import React from "react";
import { useTranslation } from "react-i18next";
import type { Member } from "../../types/member";

interface AgeDistributionChartProps {
  members: Member[];
}

const AgeDistributionChart: React.FC<AgeDistributionChartProps> = ({
  members,
}) => {
  const { t } = useTranslation();
  // Calculate age distribution
  const ageGroups = {
    "18-25": 0,
    "26-35": 0,
    "36-65": 0,
    "65+": 0,
  };

  members.forEach((member) => {
    const age = member.age;
    if (age >= 18 && age <= 25) ageGroups["18-25"]++;
    else if (age >= 26 && age <= 35) ageGroups["26-35"]++;
    else if (age >= 36 && age <= 65) ageGroups["36-65"]++;
    else if (age > 65) ageGroups["65+"]++;
  });

  const maxCount = Math.max(...Object.values(ageGroups));
  const totalMembers = members.length;

  return (
    <div className="w-full h-full">
      <div className="space-y-4">
        {Object.entries(ageGroups).map(([group, count]) => {
          const percentage =
            totalMembers > 0 ? (count / totalMembers) * 100 : 0;
          const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;

          return (
            <div key={group} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t(`analytics.ageGroups.${group}`)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {count} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {totalMembers === 0 && (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400"></div>
      )}
    </div>
  );
};

export default AgeDistributionChart;
