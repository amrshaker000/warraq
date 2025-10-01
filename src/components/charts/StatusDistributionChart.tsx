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
  const activeCount = members.filter((m) => m.status === "active").length;
  const inactiveCount = members.filter((m) => m.status === "inactive").length;
  const suspendedCount = members.filter((m) => m.status === "suspended").length;
  const total = members.length;

  const activePercentage = total > 0 ? (activeCount / total) * 100 : 0;
  const inactivePercentage = total > 0 ? (inactiveCount / total) * 100 : 0;
  const suspendedPercentage = total > 0 ? (suspendedCount / total) * 100 : 0;

  const statusData = [
    {
      label: t("analytics.statusLabels.active"),
      count: activeCount,
      percentage: activePercentage,
      color: "bg-green-500",
    },
    {
      label: t("analytics.statusLabels.inactive"),
      count: inactiveCount,
      percentage: inactivePercentage,
      color: "bg-yellow-500",
    },
    {
      label: t("analytics.statusLabels.suspended"),
      count: suspendedCount,
      percentage: suspendedPercentage,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="w-full h-full">
      <div className="space-y-4">
        {statusData.map((status, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 ${status.color} rounded-full`}></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {status.label}
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {status.count} ({status.percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className={`${status.color} h-3 rounded-full transition-all duration-300`}
                style={{ width: `${status.percentage}%` }}
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
