import React from "react";
import { useTranslation } from "react-i18next";
import type { Member } from "../../types/member";

interface FinancialSupportChartProps {
  members: Member[];
}

const FinancialSupportChart: React.FC<FinancialSupportChartProps> = ({
  members,
}) => {
  const { t } = useTranslation();

  // Calculate distribution by membership type instead of financial support
  const regularCount = members.filter((m) => m.membershipType === "regular").length;
  const premiumCount = members.filter((m) => m.membershipType === "premium").length;
  const vipCount = members.filter((m) => m.membershipType === "vip").length;
  const total = members.length;

  const regularPercentage = total > 0 ? (regularCount / total) * 100 : 0;
  const premiumPercentage = total > 0 ? (premiumCount / total) * 100 : 0;
  const vipPercentage = total > 0 ? (vipCount / total) * 100 : 0;

  return (
    <div className="w-full h-full">
      <div className="space-y-6">
        {/* Regular Members */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("analytics.membershipLabels.regular")}
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {regularCount} ({regularPercentage.toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${regularPercentage}%` }}
            />
          </div>
        </div>

        {/* Premium Members */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("analytics.membershipLabels.premium")}
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {premiumCount} ({premiumPercentage.toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-red-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${premiumPercentage}%` }}
            />
          </div>
        </div>

        {/* VIP Members */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("analytics.membershipLabels.vip")}
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {vipCount} ({vipPercentage.toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-purple-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${vipPercentage}%` }}
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

export default FinancialSupportChart;
