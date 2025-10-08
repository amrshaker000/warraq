import React from "react";
import { useTranslation } from "react-i18next";
import type { Member } from "../../types/member";

interface StatusDistributionChartProps {
  members: Member[];
}

const StatusDistributionChart: React.FC<StatusDistributionChartProps> = ({
  members,
}) => {
  const { t } = useTranslation();

  // Calculate distribution by gender instead of status
  const maleCount = members.filter((m) => m.gender === "male").length;
  const femaleCount = members.filter((m) => m.gender === "female").length;
  const total = members.length;

  const malePercentage = total > 0 ? (maleCount / total) * 100 : 0;
  const femalePercentage = total > 0 ? (femaleCount / total) * 100 : 0;

  const genderData = [
    {
      label: t("analytics.genderLabels.male"),
      count: maleCount,
      percentage: malePercentage,
      color: "bg-blue-500",
    },
    {
      label: t("analytics.genderLabels.female"),
      count: femaleCount,
      percentage: femalePercentage,
      color: "bg-pink-500",
    },
  ];

  return (
    <div className="w-full h-full">
      <div className="space-y-4">
        {genderData.map((gender, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 ${gender.color} rounded-full`}></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {gender.label}
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {gender.count} ({gender.percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className={`${gender.color} h-3 rounded-full transition-all duration-300`}
                style={{ width: `${gender.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {total === 0 && (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400"></div>
      )}
    </div>
  );
};

export default StatusDistributionChart;
