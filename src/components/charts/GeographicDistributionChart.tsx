import React from "react";
import type { Feature, MultiPolygon, Polygon } from "geojson";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { scaleQuantile } from "d3-scale";
import { useTranslation } from "react-i18next";
import type { Member } from "../../types/member";

// Extend the Member type to include the city property
type MemberWithCity = Member & {
  city?: string;
};

// You can find the GeoJSON for your region at:
// https://geojson-maps.ash.ms/
const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/saudi-arabia/saudi-arabia-provinces.json";

// Sample city coordinates - replace with actual coordinates for your regions
const cityCoordinates: Record<string, [number, number]> = {
  الرياض: [46.6753, 24.7136],
  جدة: [39.1728, 21.5433],
  "مكة المكرمة": [39.8262, 21.3891],
  "المدينة المنورة": [39.5696, 24.5247],
  الدمام: [50.1, 26.42],
  الخبر: [50.2, 26.3],
  الظهران: [50.1667, 26.3],
  الطائف: [40.512, 21.4381],
  بريدة: [43.975, 26.3667],
  تبوك: [36.5667, 28.3833],
  أبها: [42.55, 18.2167],
  نجران: [44.1167, 17.4833],
  جازان: [42.5667, 16.9],
  حائل: [41.7, 27.5167],
  الباحة: [41.4667, 20.0],
  الجوف: [40.2, 29.8],
  عرعر: [41.1333, 30.9833],
  سكاكا: [40.2, 29.9833],
};

interface GeographicDistributionChartProps {
  members: MemberWithCity[];
}

interface MarkerData {
  city: string;
  count: number;
  coordinates: [number, number];
}

interface GeoFeatureProperties {
  name: string;
  [key: string]: string | number | boolean | null | undefined;
}

interface GeoFeature
  extends Feature<MultiPolygon | Polygon, GeoFeatureProperties> {
  rsmKey?: string;
}

const GeographicDistributionChart: React.FC<
  GeographicDistributionChartProps
> = ({ members }) => {
  const { t } = useTranslation();

  // Count members by city
  const countMembersByCity = () => {
    const cityCounts: Record<string, number> = {};

    members.forEach((member: MemberWithCity) => {
      if (!member.city) return;

      const city = member.city.trim();
      if (!city) return;

      cityCounts[city] = (cityCounts[city] || 0) + 1;
    });

    return cityCounts;
  };

  const cityCounts = countMembersByCity();
  const maxCount = Math.max(...Object.values(cityCounts), 1);

  // Create a color scale
  const colorScale = scaleQuantile<string>()
    .domain([0, maxCount])
    .range([
      "#FEF2F2",
      "#FECACA",
      "#FCA5A5",
      "#F87171",
      "#EF4444",
      "#DC2626",
      "#B91C1C",
      "#991B1B",
      "#7F1D1D",
    ]);

  // Prepare data for the map
  const markers = Object.entries(cityCounts)
    .map(([city, count]): MarkerData | null => {
      const coordinates = cityCoordinates[city];
      if (!coordinates) return null;

      return {
        city,
        count,
        coordinates,
      };
    })
    .filter((marker): marker is MarkerData => marker !== null);

  const getFillColor = (count: number) => {
    return colorScale(count) || "#E5E7EB";
  };

  const getMarkerSize = (count: number) => {
    // Scale the marker size based on the count
    const baseSize = 5;
    const maxSize = 20;
    const size = Math.min(
      baseSize + (count / maxCount) * (maxSize - baseSize),
      maxSize,
    );
    return size;
  };

  if (markers.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        {t("analytics.noLocationData")}
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{
          rotate: [-44, -24, 0],
          scale: 2000,
          center: [45, 24],
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <ZoomableGroup center={[45, 24]} zoom={1}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo: GeoFeature) => (
                <Geography
                  key={`geo-${geo.properties?.name || "unknown"}`}
                  geography={geo}
                  fill="#E5E7EB"
                  stroke="#D1D5DB"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#FECACA", outline: "none" },
                    pressed: { fill: "#DC2626", outline: "none" },
                  }}
                >
                  <title>{geo.properties?.name || "Unknown region"}</title>
                </Geography>
              ))
            }
          </Geographies>
          {markers.map((marker, index) => {
            const { city, count, coordinates } = marker;
            const [longitude, latitude] = coordinates;

            return (
              <Marker
                key={`${city}-${index}`}
                coordinates={[longitude, latitude]}
              >
                <circle
                  r={getMarkerSize(count)}
                  fill={getFillColor(count)}
                  stroke="#B91C1C"
                  strokeWidth={1}
                  className="cursor-pointer transition-all duration-200 hover:opacity-80"
                >
                  <title>{`${city}: ${count} ${t("analytics.members")}`}</title>
                </circle>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-md shadow-md text-xs">
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 rounded-full bg-red-100 mr-1"></div>
          <span className="text-gray-600 dark:text-gray-300">
            1-{Math.floor(maxCount / 3)}
          </span>
        </div>
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 rounded-full bg-red-300 mr-1"></div>
          <span className="text-gray-600 dark:text-gray-300">
            {Math.floor(maxCount / 3) + 1}-{Math.floor((maxCount * 2) / 3)}
          </span>
        </div>
        <div className="flex items-center">
          <div className="w-5 h-5 rounded-full bg-red-500 mr-1"></div>
          <span className="text-gray-600 dark:text-gray-300">
            {Math.floor((maxCount * 2) / 3) + 1}+
          </span>
        </div>
      </div>
    </div>
  );
};

export default GeographicDistributionChart;
