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
    // إنشاء عنصر طباعة منفصل تماماً عن التصميم الأصلي
    const printContainer = document.createElement('div');
    printContainer.id = 'print-container';
    printContainer.style.position = 'absolute';
    printContainer.style.left = '-9999px';
    printContainer.style.top = '0';
    printContainer.style.width = '100%';

    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
        <meta charset="UTF-8">
        <title>ملف العضو - ${member.fullName}</title>
        <style>
          @page {
            size: A4;
            margin: 2mm;
          }

          * {
            margin: 0;
            padding: 0;
          }

          .print-wrapper {
            background: white;
            min-height: 100vh;
            padding: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            margin: 0 auto;
            max-width: 210mm;
          }

          .header {
            text-align: center;
            margin-bottom: 12px;
            padding: 12px;
            background: linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%);
            color: white;
            border-radius: 12px;
            position: relative;
            overflow: hidden;
          }

          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
          }

          .header h1 {
            font-size: 18px;
          }

          .header .subtitle {
            font-size: 10px;
          }

          .member-card {
            padding: 3px;
            margin-bottom: 8px;
            border: 0.5px solid #333;
          }

          .member-header {
            padding: 6px;
            gap: 8px;
          }

          .member-photo {
            width: 45px;
            height: 45px;
            border: 1px solid white;
          }

          .member-photo-placeholder {
            width: 45px;
            height: 45px;
            border: 1px solid white;
            font-size: 16px;
          }

          .member-info h2 {
            font-size: 14px;
            margin-bottom: 2px;
          }

          .member-info p {
            font-size: 10px;
            margin-bottom: 4px;
          }

          .badge {
            padding: 3px 8px;
            font-size: 8px;
            font-weight: 600;
            box-shadow: 0 2px 4px rgba(72, 187, 120, 0.2);
          }

          .info-section {
            padding: 8px;
            border-bottom: 1px solid #f7fafc;
          }

          .info-section:last-child {
            border-bottom: none;
          }

          .info-section h3 {
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 10px;
            color: #2d3748;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .info-section h3::after {
            content: '';
            flex: 1;
            height: 1px;
            background: linear-gradient(90deg, #cbd5e0 0%, transparent 100%);
            margin-right: 12px;
          }

          .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 8px;
          }

          .info-item {
            background: transparent;
            border: none;
            padding: 0;
            border-radius: 0;
          }

          .info-item:hover {
            background: transparent;
            transform: none;
          }

          .info-label {
            font-weight: 600;
            font-size: 8px;
            color: #718096;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 2px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 2px;
          }

          .info-value {
            font-size: 10px;
            color: #2d3748;
            font-weight: 500;
            word-break: break-word;
          }

          .status-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .status-badge::after {
            content: '●';
            color: white;
            font-size: 10px;
          }

          .footer {
            text-align: center;
            margin-top: 8px;
            padding: 6px;
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }

          .footer p {
            font-size: 8px;
            color: #718096;
            margin: 2px 0;
          }

          .ltr {
            direction: ltr;
            text-align: left;
            display: inline-block;
          }

          .print-date {
            background: linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%);
            color: white;
            padding: 2px 6px;
            border-radius: 10px;
            font-size: 7px;
            display: inline-block;
            margin-top: 3px;
          }

          @media print {
            body {
              background: white !important;
              margin: 0;
            }
            .print-wrapper {
              box-shadow: none !important;
              border-radius: 0 !important;
              padding: 0 !important;
            }
            .no-print {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-wrapper">
          <div class="header">
            <h1>ملف العضو</h1>
            <div class="subtitle">حزب الجبهة الوطنية - أمانة محافظة الجيزة</div>
            <div class="print-date">
              تاريخ الطباعة: ${new Date().toLocaleDateString('ar-EG')}
            </div>
          </div>
          <div class="member-card">
            <div class="member-header">
              <div class="member-photo-container">
                ${member.photo ?
                  `<img src="${member.photo}" alt="${member.fullName}" class="member-photo" loading="lazy">` :
                  `<div class="member-photo-placeholder">${member.fullName.charAt(0)}</div>`
                }
                <div class="status-badge"></div>
              </div>
              <div class="member-info">
                <h2>${member.fullName}</h2>
                <p>${member.job}</p>
                <span class="badge">${getMembershipTypeLabel(member.membershipType)}</span>
              </div>
            </div>

            <div class="info-section">
              <h3>المعلومات الشخصية</h3>
              <div class="info-grid">
                <div>
                  <div class="info-label">رقم الهوية الوطنية</div>
                  <div class="info-value ltr">${member.nationalId}</div>
                </div>
                <div>
                  <div class="info-label">رقم العضوية</div>
                  <div class="info-value ltr">${member.membershipNumber}</div>
                </div>
                <div>
                  <div class="info-label">العمر</div>
                  <div class="info-value">${member.age} سنة</div>
                </div>
                <div>
                  <div class="info-label">الجنس</div>
                  <div class="info-value">${t(`common.${member.gender}`)}</div>
                </div>
                <div>
                  <div class="info-label">الديانة</div>
                  <div class="info-value">${t(`common.${member.religion}`)}</div>
                </div>
                <div>
                  <div class="info-label">حالة العضوية</div>
                  <div class="info-value">نشط وفعال</div>
                </div>
              </div>
            </div>

            <div class="info-section">
              <h3>معلومات التواصل</h3>
              <div class="info-grid">
                <div>
                  <div class="info-label">رقم الهاتف</div>
                  <div class="info-value ltr">${member.phoneNumber}</div>
                </div>
                <div>
                  <div class="info-label">البريد الإلكتروني</div>
                  <div class="info-value">${member.email}</div>
                </div>
                <div>
                  <div class="info-label">العنوان</div>
                  <div class="info-value">${member.address}</div>
                </div>
                <div>
                  <div class="info-label">الوحدة الحزبية</div>
                  <div class="info-value">${member.partyUnit || t("common.notSpecified")}</div>
                </div>
              </div>
            </div>

            <div class="info-section">
              <h3>معلومات النظام</h3>
              <div class="info-grid">
                <div>
                  <div class="info-label">تاريخ التسجيل</div>
                  <div class="info-value">${formatDate(member.registrationDate)}</div>
                </div>
                <div>
                  <div class="info-label">آخر تحديث</div>
                  <div class="info-value">${formatDate(member.updatedAt)}</div>
                </div>
                <div>
                  <div class="info-label">الحالة</div>
                  <div class="info-value">عضو نشط</div>
                </div>
                <div>
                  <div class="info-label">الإصدار</div>
                  <div class="info-value">النسخة الرسمية</div>
                </div>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>تم إصدار هذا الملف من نظام إدارة أعضاء حزب الجبهة الوطنية</p>
            <p>جميع الحقوق محفوظة © 2024 - أمانة محافظة الجيزة</p>
          </div>
        </div>
      </body>
      </html>
    `;

    printContainer.innerHTML = printContent;
    document.body.appendChild(printContainer);

    window.print();

    // حذف العنصر بعد الطباعة
    setTimeout(() => {
      document.body.removeChild(printContainer);
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
