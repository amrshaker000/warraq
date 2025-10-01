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
  const paidCount = members.filter((m) => m.financialSupport === "paid").length;
  const unpaidCount = members.filter(
    (m) => m.financialSupport === "unpaid",
  ).length;
  const total = members.length;

  const paidPercentage = total > 0 ? (paidCount / total) * 100 : 0;
  const unpaidPercentage = total > 0 ? (unpaidCount / total) * 100 : 0;

  return (
    <div className="w-full h-full">
      <div className="space-y-6">
        {/* Paid */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("analytics.financialLabels.paid")}
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {paidCount} ({paidPercentage.toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${paidPercentage}%` }}
            />
          </div>
        </div>

        {/* Unpaid */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("analytics.financialLabels.unpaid")}
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {unpaidCount} ({unpaidPercentage.toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-red-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${unpaidPercentage}%` }}
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
