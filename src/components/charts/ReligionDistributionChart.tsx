import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Member } from '../../types/member';

interface ReligionDistributionChartProps {
  members: Member[];
}

const ReligionDistributionChart: React.FC<ReligionDistributionChartProps> = ({ members }) => {
  const { t } = useTranslation();

  // حساب توزيع الديانة - عرض كلا الديانتين حتى لو كانت قيمهم 0
  const religionStats = React.useMemo(() => {
    const stats: { muslim: number; christian: number } = {
      muslim: 0,
      christian: 0,
    };

    members.forEach((member: Member) => {
      if (member.religion && stats[member.religion as keyof typeof stats] !== undefined) {
        stats[member.religion as keyof typeof stats]++;
      }
    });

    // دائماً عرض كلا الديانتين حتى لو كانت قيمهم 0
    return Object.entries(stats)
      .map(([religion, count]) => ({
        religion,
        count,
        label: t(`common.${religion}`),
        percentage: members.length > 0 ? (count / members.length) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [members, t]);

  if (religionStats.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        {t('analytics.noDataAvailable')}
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="space-y-4">
        {religionStats.map((stat: { religion: string; count: number; label: string; percentage: number }) => {
          const maxCount = Math.max(...religionStats.map((s: { count: number }) => s.count));
          const barWidth = maxCount > 0 ? (stat.count / maxCount) * 100 : 0;

          return (
            <div key={stat.religion} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {stat.label}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.count} ({stat.percentage.toFixed(1)}%)
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
    </div>
  );
};

export default ReligionDistributionChart;
