import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Phone,
  Building,
  Calendar,
  User,
  Award,
  Printer,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import AnimatedSection from "../components/animations/AnimatedSection";

const MemberProfileCard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const { list: members } = useSelector((state: RootState) => state.members);
  const member = members.find((m) => m.id === id);

  if (!member) {
    return (
      <div className="min-h-screen flex bg-gray-50 dark:bg-dark-background-primary">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col">
          <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 p-4 lg:p-8 flex items-center justify-center">
            <Card className="p-8 text-center max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary mb-4">
                {t("members.memberNotFound")}
              </h2>
              <p className="text-gray-600 dark:text-dark-text-muted mb-6">
                {t("members.memberNotFoundDescription")}
              </p>
              <Button
                variant="primary"
                onClick={() => navigate("/members")}
                leftIcon={<ArrowLeft className="h-4 w-4" />}
              >
                {t("common.backToMembers")}
              </Button>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePrint = () => {
    const printStyles = `
      @media print {
        body * { visibility: hidden; }
        .printable-content, .printable-content * { visibility: visible; }
        .printable-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .no-print {
          display: none !important;
        }
        .member-info {
          margin: 15px 0;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin: 10px 0;
        }
        .info-item {
          padding: 8px;
          background: #f5f5f5;
          border-radius: 4px;
        }
        .info-label {
          font-weight: bold;
          color: #666;
          font-size: 12px;
        }
        .info-value {
          color: #333;
          margin-top: 2px;
        }
      }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = printStyles;
    document.head.appendChild(styleElement);

    window.print();

    setTimeout(() => {
      document.head.removeChild(styleElement);
    }, 1000);
  };

  const getMembershipTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      regular: t("members.memberTypes.regular"),
      committee: t("members.memberTypes.committee"),
      divisionSecretary: t("members.memberTypes.divisionSecretary"),
      assistantSecretary: t("members.memberTypes.assistantSecretary"),
      organizationSecretary: t("members.memberTypes.organizationSecretary"),
      secretary: t("members.memberTypes.secretary"),
      assistantSecretaryGeneral: t("members.memberTypes.assistantSecretaryGeneral"),
      baseUnitSecretary: t("members.memberTypes.baseUnitSecretary"),
      baseUnitAssistantSecretary: t("members.memberTypes.baseUnitAssistantSecretary"),
      baseUnitOrganizationSecretary: t("members.memberTypes.baseUnitOrganizationSecretary"),
      baseUnitSecretaryGeneral: t("members.memberTypes.baseUnitSecretaryGeneral"),
    };
    return typeLabels[type] || type;
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-dark-background-primary">
      <div className="no-print">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="no-print">
          <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        </div>
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <AnimatedSection className="flex items-center justify-between mb-8 no-print" delay={0.1}>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-dark-text-primary">
                  {t("members.memberProfile")}
                </h1>
                <p className="text-gray-600 dark:text-dark-text-secondary mt-1">
                  {t("members.memberDetails")}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => navigate("/members")}
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                >
                  {t("common.back")}
                </Button>
                <Button
                  variant="outline"
                  onClick={handlePrint}
                  leftIcon={<Printer className="h-4 w-4" />}
                >
                  {t("common.print")}
                </Button>
              </div>
            </AnimatedSection>

            {/* Member Profile Card */}
            <AnimatedSection delay={0.2} className="animate-fade-in">
              <Card className="bg-white dark:bg-dark-background-secondary rounded-2xl shadow-xl border-0 overflow-hidden printable-content">
                {/* Header Section with Photo */}
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-6 lg:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
                    {/* Profile Photo */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        {member.photo ? (
                          <img
                            src={member.photo}
                            alt={member.fullName}
                            className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-white dark:border-dark-border-primary shadow-lg"
                          />
                        ) : (
                          <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full bg-gray-200 dark:bg-dark-background-tertiary flex items-center justify-center border-4 border-white dark:border-dark-border-primary shadow-lg">
                            <User className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-gray-400 dark:text-dark-text-muted" />
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-dark-border-primary">
                          <Award className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 text-center lg:text-left">
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-dark-text-primary mb-2">
                        {member.fullName}
                      </h2>
                      <p className="text-base sm:text-lg text-gray-600 dark:text-dark-text-secondary mb-3 sm:mb-4">
                        {member.job}
                      </p>

                      {/* Membership Type Badge */}
                      <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3">
                        <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          {getMembershipTypeLabel(member.membershipType)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 lg:p-8">
                  <div className="space-y-6 lg:space-y-8">
                    {/* Personal Information */}
                    <div className="member-info">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-dark-text-primary mb-3 sm:mb-4 flex items-center gap-2">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400" />
                        {t("members.personalInformation")}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="info-item p-3 sm:p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                          <div className="info-label text-xs sm:text-sm text-gray-600 dark:text-white">{t("members.nationalId")}</div>
                          <div className="info-value text-sm sm:text-base ltr dark:text-white">{member.nationalId}</div>
                        </div>

                        <div className="info-item p-3 sm:p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                          <div className="info-label text-xs sm:text-sm text-gray-600 dark:text-white">{t("members.gender")}</div>
                          <div className="info-value text-sm sm:text-base dark:text-white">{t(`common.${member.gender}`)}</div>
                        </div>

                        <div className="info-item p-3 sm:p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                          <div className="info-label text-xs sm:text-sm text-gray-600 dark:text-white">{t("members.religion")}</div>
                          <div className="info-value text-sm sm:text-base dark:text-white">{t(`common.${member.religion}`)}</div>
                        </div>

                        <div className="info-item p-3 sm:p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                          <div className="info-label text-xs sm:text-sm text-gray-600 dark:text-white">{t("members.age")}</div>
                          <div className="info-value text-sm sm:text-base ltr dark:text-white">{member.age} {t("common.years")}</div>
                        </div>

                        <div className="info-item p-3 sm:p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                          <div className="info-label text-xs sm:text-sm text-gray-600 dark:text-white">{t("members.membershipNumber")}</div>
                          <div className="info-value text-sm sm:text-base ltr dark:text-white">{member.membershipNumber}</div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="member-info">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-dark-text-primary mb-3 sm:mb-4 flex items-center gap-2">
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400" />
                        {t("members.contactInformation")}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="info-item p-3 sm:p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                          <div className="info-label text-xs sm:text-sm text-gray-600 dark:text-white">{t("members.phoneNumber")}</div>
                          <div className="info-value text-sm sm:text-base ltr dark:text-white">{member.phoneNumber}</div>
                        </div>

                        <div className="info-item p-3 sm:p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                          <div className="info-label text-xs sm:text-sm text-gray-600 dark:text-white">{t("members.emailAddress")}</div>
                          <div className="info-value text-sm sm:text-base dark:text-white">{member.email}</div>
                        </div>

                        <div className="info-item p-3 sm:p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                          <div className="info-label text-xs sm:text-sm text-gray-600 dark:text-white">{t("members.address")}</div>
                          <div className="info-value text-sm sm:text-base dark:text-white">{member.address}</div>
                        </div>
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div className="member-info">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-dark-text-primary mb-3 sm:mb-4 flex items-center gap-2">
                        <Building className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400" />
                        {t("members.professionalInformation")}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="info-item p-3 sm:p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                          <div className="info-label text-xs sm:text-sm text-gray-600 dark:text-white">{t("members.job")}</div>
                          <div className="info-value text-sm sm:text-base dark:text-white">{member.job}</div>
                        </div>

                        <div className="info-item p-3 sm:p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                          <div className="info-label text-xs sm:text-sm text-gray-600 dark:text-white">{t("members.partyUnit")}</div>
                          <div className="info-value text-sm sm:text-base dark:text-white">
                            {member.partyUnit || t("common.notSpecified")}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Registration Information */}
                    <div className="member-info">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-dark-text-primary mb-3 sm:mb-4 flex items-center gap-2">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400" />
                        {t("members.registrationInformation")}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="info-item p-3 sm:p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                          <div className="info-label text-xs sm:text-sm text-gray-600 dark:text-white">{t("members.registrationDate")}</div>
                          <div className="info-value text-sm sm:text-base dark:text-white">
                            {formatDate(member.registrationDate)}
                          </div>
                        </div>

                        <div className="info-item p-3 sm:p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                          <div className="info-label text-xs sm:text-sm text-gray-600 dark:text-white">{t("members.lastUpdated")}</div>
                          <div className="info-value text-sm sm:text-base dark:text-white">
                            {formatDate(member.updatedAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </AnimatedSection>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MemberProfileCard;
