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
  Shield,
  Zap,
  Globe,
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
import { useToastContext } from "../hooks/useToastContext";
import { useMembersData } from "../hooks/useMembersData";
import mainLogo from "../../images/main logo.jpg";

const Dashboard: React.FC = () => {
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

  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: t("dashboard.features.security.title"),
      description: t("dashboard.features.security.description"),
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: t("dashboard.features.performance.title"),
      description: t("dashboard.features.performance.description"),
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: t("dashboard.features.localization.title"),
      description: t("dashboard.features.localization.description"),
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: t("dashboard.features.ux.title"),
      description: t("dashboard.features.ux.description"),
    },
  ];

  // Initialize default stats to avoid null checks throughout the component
  const safeStats = useMemo(
    () => ({
      totalMembers: stats?.totalMembers || 0,
      recentRegistrations: stats?.recentRegistrations || 0,
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
        color: "text-red-600 dark:text-dark-accent-red-400",
        bgColor: "bg-red-100 dark:bg-dark-accent-red-900",
        gradient: "from-red-500 to-red-600",
        link: "/members",
      },
      {
        title: t("dashboard.maleMembers"),
        value: safeStats.maleMembers,
        icon: <UserCheck className="h-8 w-8" />,
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-100 dark:bg-green-900",
        gradient: "from-green-500 to-green-600",
        link: "/members?gender=male",
      },
      {
        title: t("dashboard.femaleMembers"),
        value: safeStats.femaleMembers,
        icon: <DollarSign className="h-8 w-8" />,
        color: "text-yellow-600 dark:text-yellow-400",
        bgColor: "bg-yellow-100 dark:bg-yellow-900",
        gradient: "from-yellow-500 to-orange-500",
        link: "/members?gender=female",
      },
      {
        title: t("dashboard.recentActivity"),
        value: safeStats.recentRegistrations,
        icon: <TrendingUp className="h-8 w-8" />,
        color: "text-purple-600 dark:text-purple-400",
        bgColor: "bg-purple-100 dark:bg-purple-900",
        gradient: "from-purple-500 to-pink-500",
        link: "/analytics",
      },
    ],
    [
      safeStats.maleMembers,
      safeStats.femaleMembers,
      safeStats.recentRegistrations,
      safeStats.totalMembers,
      t,
    ],
  );

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-dark-background-primary">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
              <div className="text-center">
                {/* Logo Section */}
                <div className="mb-8 flex justify-center">
                  <img
                    src={mainLogo}
                    alt="Main Logo"
                  />
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                  نظام إدارة سجلات الأعضاء
                </h1>
                <p className="text-xl lg:text-2xl text-red-100 mb-8 max-w-3xl mx-auto">
                  إدارة شاملة وفعالة للسجلات الأعضاء مع تقارير متقدمة وتحليلات
                  ذكية
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <AnimatedButton
                    variant="primary"
                    size="lg"
                    onClick={() => navigate("/members")}
                    leftIcon={<Users className="h-5 w-5" />}
                    className="bg-white text-red-800 hover:bg-gray-100"
                    delay={0.1}
                  >
                    <span>{t("navigation.viewMembers")}</span>
                  </AnimatedButton>
                  <AnimatedButton
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate("/analytics")}
                    leftIcon={<BarChart3 className="h-5 w-5" />}
                    className="border-white text-white hover:bg-white hover:text-red-600"
                    delay={0.2}
                  >
                    {t("navigation.analytics")}
                  </AnimatedButton>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 lg:py-24 bg-gray-50 dark:bg-dark-background-secondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-dark-text-primary mb-4">
                  مميزات النظام
                </h2>
                <p className="text-xl text-gray-600 dark:text-dark-text-secondary max-w-2xl mx-auto">
                  نظام شامل يوفر جميع الأدوات اللازمة لإدارة الأعضاء بكفاءة
                  عالية
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <Card
                    key={index}
                    className="p-6 text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full text-white mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-text-primary mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-dark-text-secondary">
                      {feature.description}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 lg:py-24 bg-gray-100 dark:bg-dark-background-tertiary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-dark-text-primary mb-4">
                  إحصائيات النظام
                </h2>
                <p className="text-xl text-gray-600 dark:text-dark-text-secondary">
                  نظرة عامة على بيانات الأعضاء والنشاطات الأخيرة
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statCards.map((card, index) => (
                  <div
                    key={index}
                    onClick={() => card.link && navigate(card.link)}
                    className="cursor-pointer"
                  >
                    <Card
                      className={`p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 ${card.bgColor} dark:bg-dark-background-secondary dark:bg-opacity-20 group`}
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
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary mt-1">
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
                {/* Additional Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary flex items-center">
                        <Users className="h-5 w-5 ml-2 text-red-600" />
                        توزيع الأعضاء حسب النوع
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          ذكر
                        </span>
                        <span className="text-gray-900 dark:text-dark-text-primary">
                          {safeStats.maleMembers}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-pink-600 dark:text-pink-400 font-medium">
                          أنثى
                        </span>
                        <span className="text-gray-900 dark:text-dark-text-primary">
                          {safeStats.femaleMembers}
                        </span>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary flex items-center">
                        <Heart className="h-5 w-5 ml-2 text-pink-600" />
                        إحصائيات التسجيلات
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-purple-600 dark:text-purple-400 font-medium">
                          التسجيلات الأخيرة (30 يوم)
                        </span>
                        <span className="text-gray-900 dark:text-dark-text-primary">
                          {safeStats.recentRegistrations}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="py-16 lg:py-24 bg-gradient-to-r from-red-600 to-red-800 text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                ابدأ في إدارة أعضاءك
              </h2>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <AnimatedButton
                  variant="primary"
                  size="lg"
                  onClick={() => navigate("/entry")}
                  leftIcon={<Plus className="h-5 w-5" />}
                  className="bg-white text-red-600 hover:bg-gray-100"
                  delay={0.1}
                >
                  {t("members.addNewMember")}
                </AnimatedButton>
                <AnimatedButton
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate("/members")}
                  leftIcon={<Users className="h-5 w-5" />}
                  className="border-white text-white hover:bg-white hover:text-red-600"
                  delay={0.2}
                >
                  عرض جميع الأعضاء
                </AnimatedButton>
              </div>
            </div>
          </section>

          {/* Recent Activity Section */}
          <section className="py-16 lg:py-24 bg-gray-50 dark:bg-dark-background-secondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Card className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary flex items-center">
                    <Calendar className="h-6 w-6 ml-2 text-red-600" />
                    النشاطات الأخيرة
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefresh}
                    isLoading={isRefreshing}
                    leftIcon={<RefreshCw className="h-4 w-4" />}
                  >
                    تحديث
                  </Button>
                </div>
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-300 dark:text-dark-text-muted mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-dark-text-secondary text-lg">
                    {safeStats.recentRegistrations > 0
                      ? `تم تسجيل ${safeStats.recentRegistrations} عضو جديد في آخر 30 يوم`
                      : "لا توجد تسجيلات حديثة"}
                  </p>
                </div>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
