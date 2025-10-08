import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { Member } from "../../types/member";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { useTranslation } from "react-i18next";

interface RegistrationTrendChartProps {
  members: Member[];
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
}

const RegistrationTrendChart: React.FC<RegistrationTrendChartProps> = ({
  members,
  dateRange,
}) => {
  const { t, i18n } = useTranslation();

  // Generate monthly data for the selected date range
  const generateMonthlyData = () => {
    const result: { month: string; count: number }[] = [];
    const currentDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);

    // Set to first day of the month
    currentDate.setDate(1);

    while (currentDate <= endDate) {
      const month = format(currentDate, "MMM yyyy", {
        locale: i18n.language === "ar" ? arSA : undefined,
      });

      result.push({
        month,
        count: 0,
      });

      // Move to first day of next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return result;
  };

  // Count registrations per month
  const countRegistrationsByMonth = () => {
    const monthlyData = generateMonthlyData();

    members.forEach((member) => {
      if (!member.registrationDate) return;

      const registrationDate = new Date(member.registrationDate);

      // Skip if registration date is outside the selected range
      if (
        registrationDate < dateRange.startDate ||
        registrationDate > dateRange.endDate
      ) {
        return;
      }

      const monthKey = format(registrationDate, "MMM yyyy", {
        locale: i18n.language === "ar" ? arSA : undefined,
      });

      const monthData = monthlyData.find((item) => item.month === monthKey);
      if (monthData) {
        monthData.count++;
      }
    });

    return monthlyData;
  };

  const data = countRegistrationsByMonth();

  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-dark-background-secondary p-3 rounded-lg shadow-lg border border-gray-200 dark:border-dark-border-primary">
          <p className="font-medium text-gray-900 dark:text-dark-text-primary">{label}</p>
          <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
            {t("analytics.registrations")}:{" "}
            <span className="font-semibold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tick for Arabic language
  const renderCustomizedTick = (props: {
    x: number;
    y: number;
    payload: { value: string };
  }) => {
    const { x, y, payload } = props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill="#6B7280"
          className="text-xs"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-dark-text-muted">
        {t("analytics.noDataAvailable")}
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 20,
        }}
        barSize={20}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#E5E7EB"
        />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={renderCustomizedTick}
          interval={Math.ceil(data.length / 6) - 1} // Show fewer labels for better readability
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#6B7280", fontSize: 12 }}
          width={30}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
        />
        <Bar
          dataKey="count"
          name={t("analytics.registrations")}
          radius={[4, 4, 0, 0]}
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill="#EF4444" // Primary red color
              fillOpacity={0.8}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RegistrationTrendChart;
