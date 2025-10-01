import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  DollarSign,
  TrendingUp,
  BarChart3,
  Heart,
  Plus,
  ArrowRight,
  Calendar,
  RefreshCw,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import AnimatedButton from "../components/animations/AnimatedButton";
import AnimatedSection from "../components/animations/AnimatedSection";
import AnimatedList from "../components/animations/AnimatedList";
import AnimatedGroup from "../components/animations/AnimatedGroup";
import { useToastContext } from "../hooks/useToastContext";
import { useMembersData } from "../hooks/useMembersData";
import mainLogo from "/main logo.jpg";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToast } = useToastContext();
  const { stats, refreshData } = useMembersData();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refreshData();
      addToast({
        type: "success",
        title: t("common.success"),
        message: t("common.refreshSuccess"),
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      addToast({
        type: "error",
        title: t("common.error"),
        message: t("common.refreshError"),
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Initialize default stats to avoid null checks throughout the component
  const safeStats = useMemo(
    () => ({
      totalMembers: stats?.totalMembers || 0,
      activeMembers: stats?.activeMembers || 0,
      paidMembers: stats?.paidMembers || 0,
      recentRegistrations: stats?.recentRegistrations || 0,
      inactiveMembers: stats?.inactiveMembers || 0,
      suspendedMembers: stats?.suspendedMembers || 0,
      maleMembers: stats?.maleMembers || 0,
      femaleMembers: stats?.femaleMembers || 0,
    }),
    [stats],
  );

  const statCards = useMemo(
    () => [
      {
        title: t("dashboard.totalMembers"),
        value: safeStats.totalMembers,
        icon: <Users className="h-8 w-8" />,
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-100 dark:bg-blue-900",
        gradient: "from-blue-500 to-blue-600",
        link: "/members",
        description: t("dashboard.totalMembers"),
      },
      {
        title: t("dashboard.activeMembers"),
        value: safeStats.activeMembers,
        icon: <UserCheck className="h-8 w-8" />,
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-100 dark:bg-green-900",
        gradient: "from-green-500 to-green-600",
        link: "/members?status=active",
        description: t("dashboard.activeMembers"),
      },
      {
        title: t("dashboard.financialSupport"),
        value: safeStats.paidMembers,
        icon: <DollarSign className="h-8 w-8" />,
        color: "text-yellow-600 dark:text-yellow-400",
        bgColor: "bg-yellow-100 dark:bg-yellow-900",
        gradient: "from-yellow-500 to-orange-500",
        link: "/members?financialSupport=paid",
        description: t("dashboard.financialSupport"),
      },
      {
        title: t("dashboard.recentActivity"),
        value: safeStats.recentRegistrations,
        icon: <TrendingUp className="h-8 w-8" />,
        color: "text-purple-600 dark:text-purple-400",
        bgColor: "bg-purple-100 dark:bg-purple-900",
        gradient: "from-purple-500 to-pink-500",
        link: "/members?sort=recent",
        description: t("dashboard.newRegistrations", {
          count: safeStats.recentRegistrations,
        }),
      },
    ],
    [safeStats, t],
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto">
          {/* Hero Section */}
          <AnimatedSection
            className="relative bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-900 text-white py-20 lg:py-32"
            delay={0.1}
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center">
                <AnimatedGroup staggerDelay={0.3} direction="up" distance={20}>
                  <div className="mb-8 flex justify-center">
                    <div className="relative group cursor-pointer">
                      <img
                        src={mainLogo}
                        alt={t("app.title")}
                        className="h-56 w-56 rounded-full shadow-2xl object-cover relative z-10 transition-all duration-300 group-hover:scale-105"
                      />
                      {/* إطار التوهج الخارجي - يزداد عند الهوفر */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 opacity-60 blur-xl animate-pulse group-hover:opacity-80 group-hover:blur-2xl group-hover:scale-110 transition-all duration-300"></div>

                      {/* إطار التوهج الداخلي - يزداد عند الهوفر */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-300 via-purple-300 to-blue-500 opacity-40 blur-2xl group-hover:opacity-60 group-hover:blur-3xl group-hover:scale-105 transition-all duration-300"></div>

                      {/* إطار توهج إضافي للهوفر فقط */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-300 via-pink-300 to-cyan-400 opacity-0 blur-3xl group-hover:opacity-30 group-hover:scale-110 transition-all duration-500"></div>
                    </div>
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-center">
                    {t("dashboard.welcome")}
                  </h1>
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold mb-6 text-center text-white/90">
                    {t("footer.partyName")}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <AnimatedButton
                      variant="primary"
                      size="lg"
                      onClick={() => navigate("/members")}
                      leftIcon={<Users className="h-5 w-5" />}
                      delay={0.1}
                      className="w-full sm:w-auto"
                    >
                      {t("navigation.members")}
                    </AnimatedButton>
                    <AnimatedButton
                      variant="secondary"
                      size="lg"
                      onClick={() => navigate("/analytics")}
                      leftIcon={<BarChart3 className="h-5 w-5" />}
                      delay={0.2}
                      className="w-full sm:w-auto"
                    >
                      {t("navigation.analytics")}
                    </AnimatedButton>
                  </div>
                </AnimatedGroup>
              </div>
            </div>
          </AnimatedSection>

          {/* Stats Section */}
          <AnimatedSection
            className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-800"
            delay={0.2}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AnimatedGroup
                className="text-center mb-16"
                staggerDelay={0.2}
                direction="up"
                distance={15}
              >
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                  {t("dashboard.statistics")}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-center">
                  {t("dashboard.statisticsDescription")}
                </p>
              </AnimatedGroup>
              <AnimatedList
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                staggerDelay={0.1}
                direction="up"
                distance={20}
              >
                {statCards.map((card, index) => (
                  <div
                    key={index}
                    onClick={() => card.link && navigate(card.link)}
                    className="cursor-pointer"
                  >
                    <Card
                      className={`p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 ${card.bgColor} dark:bg-opacity-20 group`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className={`text-sm font-medium ${card.color}`}>
                              {card.title}
                            </p>
                            {card.link && (
                              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-current transition-transform group-hover:translate-x-1" />
                            )}
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1 text-center">
                            {card.value.toLocaleString()}
                          </h3>
                        </div>
                        <div
                          className={`p-3 rounded-lg ${card.bgColor} bg-opacity-30`}
                        >
                          {card.icon}
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </AnimatedList>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <Users className="h-5 w-5 mr-2 text-blue-600" />
                      {t("dashboard.memberStatus")}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {t("common.active")}
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {safeStats.activeMembers}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                        {t("common.inactive")}
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {safeStats.inactiveMembers}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        {t("common.suspended")}
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {safeStats.suspendedMembers}
                      </span>
                    </div>
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <Heart className="h-5 w-5 mr-2 text-pink-600" />
                      {t("dashboard.genderDistribution")}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {t("common.male")}
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {safeStats.maleMembers}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-pink-600 dark:text-pink-400 font-medium">
                        {t("common.female")}
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {safeStats.femaleMembers}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </AnimatedSection>

          {/* Call to Action Section */}
          <AnimatedSection
            className="py-16 lg:py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            delay={0.4}
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <AnimatedGroup staggerDelay={0.3} direction="up" distance={15}>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-center font-arabic">
                  {t("dashboard.callToAction.title")}
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <AnimatedButton
                    variant="primary"
                    size="lg"
                    onClick={() => navigate("/entry")}
                    leftIcon={<Plus className="h-5 w-5" />}
                    className="w-full sm:w-auto"
                    delay={0.1}
                  >
                    {t("navigation.addMember")}
                  </AnimatedButton>
                  <AnimatedButton
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate("/members")}
                    leftIcon={<Users className="h-5 w-5" />}
                    className="w-full sm:w-auto"
                    delay={0.2}
                  >
                    {t("navigation.viewMembers")}
                  </AnimatedButton>
                </div>
              </AnimatedGroup>
            </div>
          </AnimatedSection>

          {/* Recent Activity Section */}
          <AnimatedSection
            className="py-16 lg:py-24 bg-white dark:bg-gray-900"
            delay={0.6}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Card className="p-8">
                <AnimatedGroup staggerDelay={0.2} direction="up" distance={15}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      <Calendar className="h-6 w-6 mr-2 text-blue-600" />
                      {t("dashboard.recentActivity")}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRefresh}
                      isLoading={isRefreshing}
                      leftIcon={<RefreshCw className="h-4 w-4" />}
                    >
                      {t("common.refresh")}
                    </Button>
                  </div>
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      {safeStats.recentRegistrations > 0
                        ? t("dashboard.newRegistrations", {
                            count: safeStats.recentRegistrations,
                          })
                        : t("dashboard.noRecentRegistrations")}
                    </p>
                  </div>
                </AnimatedGroup>
              </Card>
            </div>
          </AnimatedSection>
        </main>
      </div>
    </div>
  );
};

export default Home;
