import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Member } from '../../types/member';

interface PartyUnitDistributionChartProps {
  members: Member[];
}

// تعريف قائمة بالوحدات الحزبية الشائعة
const COMMON_PARTY_UNITS = [
  'وراق الحضر',
  'وراق العرب',
  'جزيرة محمد',
  'طناش',
  'عزبة المفتى',
  'عزبة الخلايفة'
];

const PartyUnitDistributionChart: React.FC<PartyUnitDistributionChartProps> = ({ members }) => {
  const { t } = useTranslation();

  // حساب توزيع الوحدات الحزبية
  const partyUnitStats = React.useMemo(() => {
    const stats: { [key: string]: number } = {};

    // تهيئة الوحدات الشائعة بصفر
    COMMON_PARTY_UNITS.forEach(unit => {
      stats[unit] = 0;
    });

    // تهيئة الوحدات الأخرى بصفر أيضاً
    members.forEach(member => {
      const unit = member.partyUnit || 'غير محدد';
      if (!stats[unit]) {
        stats[unit] = 0;
      }
    });

    // حساب الأعداد الفعلية
    members.forEach(member => {
      const unit = member.partyUnit || 'غير محدد';
      stats[unit]++;
    });

    return Object.entries(stats)
      .map(([unit, count]) => ({ unit, count }))
      .sort((a, b) => {
        // ترتيب حسب الأولوية: أولاً الوحدات المستخدمة، ثم الباقي
        if (a.count > 0 && b.count === 0) return -1;
        if (a.count === 0 && b.count > 0) return 1;
        return b.count - a.count;
      })
      .slice(0, 8); // أفضل 8 وحدات
  }, [members]);

  const maxCount = Math.max(...partyUnitStats.map(stat => stat.count));
  const totalMembers = members.length;

  if (partyUnitStats.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        {t('analytics.noDataAvailable')}
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="space-y-4">
        {partyUnitStats.map((stat) => {
          const percentage = totalMembers > 0 ? (stat.count / totalMembers) * 100 : 0;
          const barWidth = maxCount > 0 ? (stat.count / maxCount) * 100 : 0;

          return (
            <div key={stat.unit} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {stat.unit}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.count} ({percentage.toFixed(1)}%)
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

export default PartyUnitDistributionChart;
