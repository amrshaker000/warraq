import React from "react";
import { useTranslation } from "react-i18next";
import type { Member } from "../../types/member";

interface GenderDistributionChartProps {
  members: Member[];
}

const GenderDistributionChart: React.FC<GenderDistributionChartProps> = ({
  members,
}) => {
  const { t } = useTranslation();
  const maleCount = members.filter((m) => m.gender === "male").length;
  const femaleCount = members.filter((m) => m.gender === "female").length;
  const total = members.length;

  const malePercentage = total > 0 ? (maleCount / total) * 100 : 0;
  const femalePercentage = total > 0 ? (femaleCount / total) * 100 : 0;

  return (
    <div className="w-full h-full">
      <div className="space-y-6">
        {/* Male */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t(`analytics.genderLabels.male`)}
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {maleCount} ({malePercentage.toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-red-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${malePercentage}%` }}
            />
          </div>
        </div>

        {/* Female */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t(`analytics.genderLabels.female`)}
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {femaleCount} ({femalePercentage.toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-pink-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${femalePercentage}%` }}
            />
          </div>
        </div>
      </div>

      {total === 0 && (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400"></div>
      )}
    </div>
  );
};

export default GenderDistributionChart;
