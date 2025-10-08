import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Users,
  BarChart3,
  Shield,
  Plus,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import AnimatedButton from "../components/animations/AnimatedButton";
import AnimatedSection from "../components/animations/AnimatedSection";
import AnimatedGroup from "../components/animations/AnimatedGroup";
import { useMembersData } from "../hooks/useMembersData";
import mainLogo from "/main logo.jpg";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { stats, members } = useMembersData();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Initialize default stats to avoid null checks throughout the component
  const safeStats = useMemo(
    () => {
      const muslimMembers = members?.filter(member => member.religion === 'muslim').length || 0;
      const christianMembers = members?.filter(member => member.religion === 'christian').length || 0;

      return {
        totalMembers: stats?.totalMembers || 0,
        recentRegistrations: stats?.recentRegistrations || 0,
        maleMembers: stats?.maleMembers || 0,
        femaleMembers: stats?.femaleMembers || 0,
        muslimMembers,
        christianMembers,
      };
    },
    [stats, members],
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto">
          {/* Hero Section */}
          <AnimatedSection
            className="relative bg-gradient-to-r from-red-600 to-red-800 dark:from-red-800 dark:to-red-900 text-white py-20 lg:py-32"
            delay={0.1}
          >
            <div className="absolute inset-0 overflow-hidden" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center">
                <AnimatedGroup staggerDelay={0.3} direction="up" distance={20}>
                  <div className="mb-8 flex justify-center">
                    <div className="relative group cursor-pointer" onClick={() => window.location.reload()}>
                      <img
                        src={mainLogo}
                        alt={t("app.title")}
                        className="h-56 w-56 rounded-full shadow-2xl object-cover relative z-10 transition-all duration-300 group-hover:scale-105"
                      />
                      {/* إطار التوهج الخارجي - يزداد عند الهوفر */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 via-red-500 to-red-600 opacity-60 blur-xl animate-pulse group-hover:opacity-80 group-hover:blur-2xl group-hover:scale-110 transition-all duration-300"></div>

                      {/* إطار التوهج الداخلي - يزداد عند الهوفر */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-300 via-red-400 to-red-500 opacity-40 blur-2xl group-hover:opacity-60 group-hover:blur-3xl group-hover:scale-105 transition-all duration-300"></div>

                      {/* إطار توهج إضافي للهوفر فقط */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-300 via-red-400 to-red-500 opacity-0 blur-3xl group-hover:opacity-30 group-hover:scale-110 transition-all duration-500"></div>
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
                      className="w-full sm:w-auto dark:bg-[#0f1419]"
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
            className="py-16 lg:py-24 bg-gray-50 dark:bg-dark-background-primary"
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

              {/* Enhanced Analytics Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <Card className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <Users className="h-5 w-5 mr-2 text-red-600" />
                      {t("dashboard.genderDistribution")}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          {t("common.male")}
                        </span>
                      </div>
                      <span className="text-gray-900 dark:text-white font-bold">
                        {safeStats.maleMembers}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                        <span className="text-pink-600 dark:text-pink-400 font-medium">
                          {t("common.female")}
                        </span>
                      </div>
                      <span className="text-gray-900 dark:text-white font-bold">
                        {safeStats.femaleMembers}
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                      {t("analytics.ageDistribution")}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t("common.newAgeGroups")}</p>
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                        18-25, 25-35, 35-45, 45-60, 60-80
                      </p>
                    </div>
                    <div className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/analytics")}
                        className="w-full"
                      >
                        {t("common.viewDetails")}
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-pink-600" />
                      {t("analytics.religionDistribution")}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {t("common.muslimMembers")}
                        </span>
                      </div>
                      <span className="text-gray-900 dark:text-white font-bold">
                        {safeStats.muslimMembers}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          {t("common.christianMembers")}
                        </span>
                      </div>
                      <span className="text-gray-900 dark:text-white font-bold">
                        {safeStats.christianMembers}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </AnimatedSection>

          {/* Call to Action Section */}
          <AnimatedSection
            className="py-16 lg:py-24 bg-gradient-to-r from-red-600 to-red-800 text-white"
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
                    className="w-full sm:w-auto dark:bg-[#0f1419]"
                    delay={0.2}
                  >
                    {t("navigation.viewMembers")}
                  </AnimatedButton>
                </div>
              </AnimatedGroup>
            </div>
          </AnimatedSection>

          {/* Footer */}
          <footer className="bg-white dark:bg-dark-background-primary text-red-900 dark:text-red-300 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-center items-center">
                <p className="text-gray-900 dark:text-red-300 text-sm text-center">
                  © {new Date().getFullYear()} {t("footer.partyName")} - {t("app.title")}. {t("footer.copyright")}
                </p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Home;
