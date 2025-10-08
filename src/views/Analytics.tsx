import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { getMembers, getMemberStats } from "../slices/membersSlice";
import TopNav from "../components/TopNav";
import Sidebar from "../components/Sidebar";
import Card from "../components/ui/Card";
import ChartContainer from "../components/charts/ChartContainer";
import AgeDistributionChart from "../components/charts/AgeDistributionChart";
import GenderDistributionChart from "../components/charts/GenderDistributionChart";
import PartyUnitDistributionChart from "../components/charts/PartyUnitDistributionChart";
import MemberTypeDistributionChartPart1 from "../components/charts/MemberTypeDistributionChartPart1";
import MemberTypeDistributionChartPart2 from "../components/charts/MemberTypeDistributionChartPart2";
import ReligionDistributionChart from "../components/charts/ReligionDistributionChart";
import RegistrationTrendChart from "../components/charts/RegistrationTrendChart";
import AnimatedSection from "../components/animations/AnimatedSection";
import Button from "../components/ui/Button";
import { BarChart3, RefreshCw } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { useActivity } from "../contexts/ActivityContext";
import type { Member } from "../types/member";
import colourfulLogo from "/colourfull logo.png";
import goldLogo from "/Gold logo.png";

const Analytics: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { list: members = [], stats } = useSelector(
    (state: RootState) => state.members,
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { activities } = useActivity();
  const { theme } = useTheme();
  const [dateRange] = useState({
    startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    endDate: new Date(),
  });
  const [filters] = useState({
    gender: "all",
  });

  const fetchData = useCallback(() => {
    const params = {
      startDate: dateRange.startDate.toISOString().split("T")[0],
      endDate: dateRange.endDate.toISOString().split("T")[0],
      ...(filters.gender !== "all" && { gender: filters.gender }),
    };

    // @ts-expect-error - Fix the action types in your Redux slice
    dispatch(getMembers(params));
    // @ts-expect-error - Fix the action types in your Redux slice
    dispatch(getMemberStats(params));
  }, [dateRange, filters, dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter members based on selected filters
  const filteredMembers = members.filter((member: Member) => {
    const matchesGender =
      filters.gender === "all" || member.gender === filters.gender;

    return matchesGender;
  });

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-dark-background-primary">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 lg:p-6">
          {/* Header */}
          <AnimatedSection
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0"
            delay={0.1}
          >
            <div className="flex items-center space-x-6 rtl:space-x-reverse">
              <img
                src={theme === "dark" ? goldLogo : colourfulLogo}
                alt="logo"
                className="h-32 w-32 lg:h-40 lg:w-40 object-contain"
              />
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-dark-text-primary">
                  {t("navigation.analytics")}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {t("analytics.subtitle")}
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Featured Member Count Card */}
          <AnimatedSection
            className="mb-8"
            delay={0.2}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white p-8 lg:p-12 shadow-2xl">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="text-center lg:text-left mb-6 lg:mb-0">
                  <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                    {t("analytics.totalMembersTitle")}
                  </h2>
                  <p className="text-red-100 text-lg">
                    {t("analytics.asOf")} {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="text-center lg:text-right">
                  <div className="text-6xl lg:text-7xl font-bold mb-2">
                    {stats?.totalMembers ? stats.totalMembers.toLocaleString() : 0}
                  </div>
                  <p className="text-red-100 text-xl">
                    {t("analytics.registeredMemberText")}
                  </p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 opacity-20">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </Card>
          </AnimatedSection>

          {/* Analytics Content - New Layout */}
          <div className="space-y-8">
            {/* Registration Trends - No changes */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("analytics.registrationTrends")}
                </h3>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-1"></span>
                    {t("analytics.registrations")}
                  </span>
                </div>
              </div>
              <div className="h-80">
                {members && members.length > 0 ? (
                  <RegistrationTrendChart
                    members={members}
                    dateRange={dateRange}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-dark-text-muted">
                    {t("analytics.noDataAvailable")}
                  </div>
                )}
              </div>
            </Card>

            {/* Member Type Distribution - Split into Two Parts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ChartContainer title={t("analytics.memberTypeDistribution")} height="h-80 lg:h-96">
                {filteredMembers && filteredMembers.length > 0 ? (
                  <MemberTypeDistributionChartPart1 members={filteredMembers} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-dark-text-muted">
                    {t("analytics.noDataAvailable")}
                  </div>
                )}
              </ChartContainer>
              <ChartContainer title={t("analytics.memberTypeDistribution")} height="h-80 lg:h-96">
                {filteredMembers && filteredMembers.length > 0 ? (
                  <MemberTypeDistributionChartPart2 members={filteredMembers} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-dark-text-muted">
                    {t("analytics.noDataAvailable")}
                  </div>
                )}
              </ChartContainer>
            </div>

            {/* Age & Party Unit Distribution - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ChartContainer title={t("analytics.ageDistribution")} height="h-80 lg:h-96">
                {filteredMembers && filteredMembers.length > 0 ? (
                  <AgeDistributionChart members={filteredMembers} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-dark-text-muted">
                    {t("analytics.noDataAvailable")}
                  </div>
                )}
              </ChartContainer>
              <ChartContainer title={t("analytics.partyUnitDistribution")} height="h-80 lg:h-96">
                {filteredMembers && filteredMembers.length > 0 ? (
                  <PartyUnitDistributionChart members={filteredMembers} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-dark-text-muted">
                    {t("analytics.noDataAvailable")}
                  </div>
                )}
              </ChartContainer>
            </div>

            {/* Gender & Religion Distribution - Smaller Cards Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ChartContainer title={t("analytics.genderDistribution")} height="h-48 lg:h-64">
                {filteredMembers && filteredMembers.length > 0 ? (
                  <GenderDistributionChart members={filteredMembers} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-dark-text-muted">
                    {t("analytics.noDataAvailable")}
                  </div>
                )}
              </ChartContainer>
              <ChartContainer title={t("analytics.religionDistribution")} height="h-48 lg:h-64">
                {filteredMembers && filteredMembers.length > 0 ? (
                  <ReligionDistributionChart members={filteredMembers} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-dark-text-muted">
                    {t("analytics.noDataAvailable")}
                  </div>
                )}
              </ChartContainer>
            </div>
          </div>

          {/* Recent Activity Section - آخر التعديلات */}
          <AnimatedSection
            className="py-16 lg:py-24 bg-transparent dark:bg-transparent"
            delay={0.6}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Card className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary flex items-center">
                    <BarChart3 className="h-6 w-6 mr-2 text-red-600" />
                    {t("analytics.recentActivity")}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.reload()}
                    leftIcon={<RefreshCw className="h-4 w-4" />}
                  >
                    {t("common.refresh")}
                  </Button>
                </div>
                <div className="space-y-4">
                  {activities.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">{t("analytics.noRecentActivity")}</p>
                    </div>
                  ) : (
                    activities.map((activity) => (
                      <div
                        key={activity.id}
                        className={`p-4 rounded-lg border-r-4 ${
                          activity.type === 'add' ? 'bg-red-50 dark:bg-red-900/20 border-red-500' :
                          activity.type === 'edit' ? 'bg-green-50 dark:bg-green-900/20 border-green-500' :
                          activity.type === 'delete' ? 'bg-red-50 dark:bg-red-900/20 border-red-500' :
                          'bg-purple-50 dark:bg-purple-900/20 border-purple-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-sm font-medium ${
                              activity.type === 'add' ? 'text-red-700 dark:text-red-300' :
                              activity.type === 'edit' ? 'text-green-700 dark:text-green-300' :
                              activity.type === 'delete' ? 'text-red-700 dark:text-red-300' :
                              'text-purple-700 dark:text-purple-300'
                            }`}>
                              {activity.memberName}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {activity.description}
                              {activity.details && ` - ${activity.details}`}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {activity.timestamp.toLocaleDateString('ar-EG')}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </AnimatedSection>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
