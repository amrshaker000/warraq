import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Member } from '../../types/member';

interface MemberTypeDistributionChartPart2Props {
  members: Member[];
}

// باقي أنواع العضوية (5 أنواع)
const SECOND_PART_MEMBER_TYPES = [
  "assistantSecretaryGeneral",
  "baseUnitSecretary",
  "baseUnitAssistantSecretary",
  "baseUnitOrganizationSecretary",
  "baseUnitSecretaryGeneral"
];

const MemberTypeDistributionChartPart2: React.FC<MemberTypeDistributionChartPart2Props> = ({ members }) => {
  const { t } = useTranslation();

  // حساب توزيع أنواع العضوية - الجزء الثاني فقط
  const memberTypeStats = React.useMemo(() => {
    const stats: { [key: string]: number } = {};

    // تهيئة الأنواع الثانية فقط بصفر
    SECOND_PART_MEMBER_TYPES.forEach(type => {
      stats[type] = 0;
    });

    // حساب الأعداد الفعلية
    members.forEach(member => {
      const type = member.membershipType;
      if (stats[type] !== undefined) {
        stats[type]++;
      }
    });

    return Object.entries(stats)
      .map(([type, count]) => ({
        type,
        count,
        label: t(`members.memberTypes.${type}`, type)
      }))
      // إظهار جميع الأنواع حتى لو كانت قيمها 0
      .sort((a, b) => b.count - a.count);
  }, [members, t]);

  const maxCount = Math.max(...memberTypeStats.map(stat => stat.count));
  const totalMembers = members.length;

  if (memberTypeStats.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        {t('analytics.noDataAvailable')}
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="space-y-3">
        {memberTypeStats.map((stat) => {
          const percentage = totalMembers > 0 ? (stat.count / totalMembers) * 100 : 0;
          const barWidth = maxCount > 0 ? (stat.count / maxCount) * 100 : 0;

          return (
            <div key={stat.type} className="space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 break-words">
                    {stat.label}
                  </span>
                </div>
                <div className="flex-shrink-0 ml-2">
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {stat.count} ({percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3">
                <div
                  className="bg-primary-600 h-2 sm:h-3 rounded-full transition-all duration-300"
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

export default MemberTypeDistributionChartPart2;
