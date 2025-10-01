import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { getMembers, getMemberStats } from "../slices/membersSlice";
import {
  Users,
  UserCheck,
  DollarSign,
  TrendingUp,
  Activity,
  UserPlus,
} from "lucide-react";
import TopNav from "../components/TopNav";
import Sidebar from "../components/Sidebar";
import Card from "../components/ui/Card";
import ChartContainer from "../components/charts/ChartContainer";
import AgeDistributionChart from "../components/charts/AgeDistributionChart";
import GenderDistributionChart from "../components/charts/GenderDistributionChart";
import StatusDistributionChart from "../components/charts/StatusDistributionChart";
import FinancialSupportChart from "../components/charts/FinancialSupportChart";
import RegistrationTrendChart from "../components/charts/RegistrationTrendChart";
import GeographicDistributionChart from "../components/charts/GeographicDistributionChart";
import AnimatedSection from "../components/animations/AnimatedSection";
import AnimatedGroup from "../components/animations/AnimatedGroup";
import type { Member } from "../types/member";
import { useTheme } from "../hooks/useTheme";
import blackLogo from "/black logo.png";
import whiteLogo from "/white logo.png";

const Analytics: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { list: members, stats } = useSelector(
    (state: RootState) => state.members,
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();
  const [dateRange] = useState({
    startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    endDate: new Date(),
  });
  const [filters] = useState({
    status: "all",
    gender: "all",
    financialStatus: "all",
  });
  const [activeTab, setActiveTab] = useState("overview");

  const fetchData = useCallback(() => {
    const params = {
      startDate: dateRange.startDate.toISOString().split("T")[0],
      endDate: dateRange.endDate.toISOString().split("T")[0],
      ...(filters.status !== "all" && { status: filters.status }),
      ...(filters.gender !== "all" && { gender: filters.gender }),
      ...(filters.financialStatus !== "all" && {
        financialStatus: filters.financialStatus,
      }),
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
    const matchesStatus =
      filters.status === "all" || member.status === filters.status;
    const matchesGender =
      filters.gender === "all" || member.gender === filters.gender;
    const matchesFinancialStatus =
      filters.financialStatus === "all" ||
      (filters.financialStatus === "paid"
        ? member.financialSupport === "paid"
        : member.financialSupport === "unpaid");

    return matchesStatus && matchesGender && matchesFinancialStatus;
  });

  // Calculate additional statistics
  const activeMembersPercentage = stats?.totalMembers
    ? (stats.activeMembers / stats.totalMembers) * 100
    : 0;

  const paidMembersPercentage = stats?.totalMembers
    ? (stats.paidMembers / stats.totalMembers) * 100
    : 0;

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 lg:p-6">
          {/* Header and Filters */}
          <AnimatedSection
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0"
            delay={0.1}
          >
            <div className="flex items-center space-x-6 rtl:space-x-reverse">
              <img
                src={theme === "dark" ? whiteLogo : blackLogo}
                alt="logo"
                className="h-32 w-32 lg:h-40 lg:w-40 object-contain"
              />
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  {t("navigation.analytics")}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {t("analytics.subtitle")}
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Tabs */}
          <AnimatedSection
            className="border-b border-gray-200 dark:border-gray-700 mb-6"
            delay={0.2}
          >
            <nav className="-mb-px flex justify-between" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("overview")}
                className={`${activeTab === "overview" ? "border-primary-500 text-primary-600 dark:text-primary-400" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200"} whitespace-nowrap py-4 px-4 border-b-4 font-medium text-base`}
              >
                {t("analytics.tabs.overview")}
              </button>
              <button
                onClick={() => setActiveTab("members")}
                className={`${activeTab === "members" ? "border-primary-500 text-primary-600 dark:text-primary-400" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200"} whitespace-nowrap py-4 px-4 border-b-4 font-medium text-base`}
              >
                {t("analytics.tabs.members")}
              </button>
              <button
                onClick={() => setActiveTab("financial")}
                className={`${activeTab === "financial" ? "border-primary-500 text-primary-600 dark:text-primary-400" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200"} whitespace-nowrap py-4 px-4 border-b-4 font-medium text-base`}
              >
                {t("analytics.tabs.financial")}
              </button>
              <button
                onClick={() => setActiveTab("geographic")}
                className={`${activeTab === "geographic" ? "border-primary-500 text-primary-600 dark:text-primary-400" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200"} whitespace-nowrap py-4 px-4 border-b-4 font-medium text-base`}
              >
                {t("analytics.tabs.geographic")}
              </button>
            </nav>
          </AnimatedSection>

          {/* Stats Cards */}
          <AnimatedGroup
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            staggerDelay={0.1}
            direction="up"
            distance={15}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t("dashboard.totalMembers")}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stats?.totalMembers?.toLocaleString() || 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t("analytics.asOf")} {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t("dashboard.activeMembers")}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stats?.activeMembers?.toLocaleString() || 0}
                  </p>
                  <div className="mt-1">
                    <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                      {activeMembersPercentage.toFixed(1)}%{" "}
                      {t("analytics.ofTotal")}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                  <UserCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t("members.financialSupportStatus")}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stats?.paidMembers?.toLocaleString() || 0}
                  </p>
                  <div className="mt-1">
                    <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full">
                      {paidMembersPercentage.toFixed(1)}%{" "}
                      {t("analytics.paidRate")}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900">
                  <DollarSign className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t("analytics.registrations")}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stats?.recentRegistrations?.toLocaleString() || 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t("analytics.last30Days")}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                  <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </Card>
          </AnimatedGroup>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Registration Trends */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t("analytics.registrationTrends")}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
                      {t("analytics.registrations")}
                    </span>
                  </div>
                </div>
                <div className="h-80">
                  <RegistrationTrendChart
                    members={members}
                    dateRange={dateRange}
                  />
                </div>
              </Card>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartContainer title={t("analytics.ageDistribution")}>
                  <AgeDistributionChart members={filteredMembers} />
                </ChartContainer>
                <ChartContainer title={t("analytics.genderDistribution")}>
                  <GenderDistributionChart members={filteredMembers} />
                </ChartContainer>
                <ChartContainer title={t("analytics.memberStatus")}>
                  <StatusDistributionChart members={filteredMembers} />
                </ChartContainer>
                <ChartContainer title={t("analytics.financialStatus")}>
                  <FinancialSupportChart members={filteredMembers} />
                </ChartContainer>
              </div>
            </div>
          )}

          {activeTab === "members" && (
            <div className="space-y-8">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  {t("analytics.memberDemographics")}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                      {t("analytics.ageDistribution")}
                    </h4>
                    <div className="h-64">
                      <AgeDistributionChart members={filteredMembers} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                      {t("analytics.genderDistribution")}
                    </h4>
                    <div className="h-64">
                      <GenderDistributionChart members={filteredMembers} />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  {t("analytics.memberStatus")}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                      {t("analytics.memberStatus")}
                    </h4>
                    <div className="h-64">
                      <StatusDistributionChart members={filteredMembers} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                      {t("analytics.registrationTrends")}
                    </h4>
                    <div className="h-64">
                      <RegistrationTrendChart
                        members={filteredMembers}
                        dateRange={dateRange}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "financial" && (
            <div className="space-y-8">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  {t("analytics.financialOverview")}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                      {t("analytics.financialStatus")}
                    </h4>
                    <div className="h-64">
                      <FinancialSupportChart members={filteredMembers} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                      {t("analytics.paymentHistory")}
                    </h4>
                    <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-gray-500 dark:text-gray-400">
                        {t("analytics.comingSoon")}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  {t("analytics.financialTrends")}
                </h3>
                <div className="h-80 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    {t("analytics.comingSoon")}
                  </p>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "geographic" && (
            <div className="space-y-8">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  {t("analytics.geographicDistribution")}
                </h3>
                <div className="h-[500px]">
                  <GeographicDistributionChart members={filteredMembers} />
                </div>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                    {t("analytics.topRegions")}
                  </h4>
                  <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">
                      {t("analytics.comingSoon")}
                    </p>
                  </div>
                </Card>
                <Card className="p-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                    {t("analytics.regionComparison")}
                  </h4>
                  <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">
                      {t("analytics.comingSoon")}
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Quick Stats Summary */}
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              {t("analytics.quickStats")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    {t("dashboard.totalMembers")}
                  </span>
                </div>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                  {stats?.totalMembers?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-blue-700/70 dark:text-blue-300/70 mt-1">
                  {t("analytics.asOf")} {new Date().toLocaleDateString()}
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    {t("analytics.activeMembers")}
                  </span>
                </div>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-2">
                  {stats?.activeMembers?.toLocaleString() || 0}
                </p>
                <div className="mt-1">
                  <span className="text-xs font-medium text-green-700 dark:text-green-300 bg-green-100/50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                    {activeMembersPercentage.toFixed(1)}%{" "}
                    {t("analytics.ofTotal")}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800/30">
                <div className="flex items-center">
                  <UserPlus className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                  <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                    {t("analytics.newRegistrations")}
                  </span>
                </div>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-2">
                  +{stats?.recentRegistrations?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-purple-700/70 dark:text-purple-300/70 mt-1">
                  {t("analytics.last30Days")}
                </p>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800/30">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
                  <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    {t("analytics.paidMembers")}
                  </span>
                </div>
                <p className="text-2xl font-bold text-amber-900 dark:text-amber-100 mt-2">
                  {stats?.paidMembers?.toLocaleString() || 0}
                </p>
                <div className="mt-1">
                  <span className="text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-100/50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                    {paidMembersPercentage.toFixed(1)}%{" "}
                    {t("analytics.paidRate")}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
