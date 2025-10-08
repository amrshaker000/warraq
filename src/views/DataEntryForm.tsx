import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  CreditCard,
  Download,
  ArrowLeft,
  Edit,
  Eye,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import AnimatedSection from "../components/animations/AnimatedSection";
import AnimatedGroup from "../components/animations/AnimatedGroup";
import type { MemberFormData, MembershipType } from "../types/member";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { addMember, updateMember } from "../slices/membersSlice";
import { useToastContext } from "../hooks/useToastContext";

const DataEntryForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addToast } = useToastContext();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { list: members } = useSelector((state: RootState) => state.members);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<MemberFormData>({
    defaultValues: {
      fullName: "",
      nationalId: "",
      gender: "male",
      phoneNumber: "",
      landlineNumber: "",
      partyUnit: "وراق الحضر",
      email: "",
      membershipNumber: "",
      age: 18,
      address: "",
      job: "",
      membershipType: "regular",
    },
  });

  useEffect(() => {
    if (id) {
      // Check if this is view-only mode by checking URL search params or state
      const urlParams = new URLSearchParams(window.location.search);
      const viewMode = urlParams.get("mode") === "view";

      if (viewMode) {
        setIsViewOnly(true);
        setIsEditing(false);
      } else {
        setIsEditing(true);
        setIsViewOnly(false);
      }

      const member = members.find((m) => m.id === id);
      if (member) {
        setValue("fullName", member.fullName);
        setValue("nationalId", member.nationalId);
        setValue("gender", member.gender);
        setValue("religion", member.religion);
        setValue("phoneNumber", member.phoneNumber);
        setValue("landlineNumber", member.landlineNumber || "");
        setValue("partyUnit", member.partyUnit || "وراق الحضر");
        setValue("email", member.email);
        setValue("membershipNumber", member.membershipNumber);
        setValue("age", member.age);
        setValue("address", member.address);
        setValue("job", member.job);
        setValue("membershipType", member.membershipType);
        if (member.photo) {
          setPhotoPreview(member.photo);
        }
      }
    } else {
      setIsEditing(false);
      setIsViewOnly(false);
    }
  }, [id, setValue, members]);

  const onSubmit = async (data: MemberFormData) => {
    setFormError(null);
    setIsLoading(true);
    try {
      const memberData = {
        id: isEditing ? id || `member_${Date.now()}` : `member_${Date.now()}`,
        fullName: data.fullName,
        nationalId: data.nationalId,
        gender: data.gender,
        phoneNumber: data.phoneNumber,
        landlineNumber: data.landlineNumber,
        partyUnit: data.partyUnit,
        email: data.email,
        membershipNumber: data.membershipNumber,
        age: data.age,
        address: data.address,
        job: data.job,
        membershipType: data.membershipType,
        religion: data.religion,
        registrationDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        photo: typeof data.photo === "string" ? data.photo : undefined,
      };

      if (isEditing) {
        try {
          await dispatch(
            updateMember({
              id: memberData.id,
              member: memberData,
            }),
          ).unwrap();
          addToast({
            title: t("common.success"),
            message: t("members.updateSuccessWithName", {
              name: memberData.fullName,
            }),
            type: "success",
          });
        } catch {
          addToast({
            title: t("common.error"),
            message: t("members.updateDuplicateError"),
            type: "error",
          });
          setFormError(t("members.updateDuplicateError"));
          return;
        }
      } else {
        try {
          await dispatch(addMember(memberData)).unwrap();
          addToast({
            title: t("common.success"),
            message: t("members.addSuccessWithName", {
              name: memberData.fullName,
            }),
            type: "success",
          });
        } catch {
          addToast({
            title: t("common.error"),
            message: t("members.addDuplicateError"),
            type: "error",
          });
          setFormError(t("members.addDuplicateError"));
          return;
        }
      }
      navigate("/members");
    } catch {
      addToast({
        title: t("common.error"),
        message: t("messages.saveError"),
        type: "error",
      });
      setFormError(t("messages.saveError"));
    } finally {
      setIsLoading(false);
    }
  };

  // Excel Import Handler - Enhanced Excel file processing
  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("=== EXCEL IMPORT START ===");
    console.log("File:", file.name, "Size:", file.size, "Type:", file.type);
    setIsImporting(true);

    try {
      // Import Excel processing library
      const XLSX = await import("xlsx");

      // Read file as array buffer
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });

      // Get first worksheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert to JSON with headers
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
        blankrows: false,
      });

      console.log("Excel data parsed:", jsonData);

      if (jsonData.length === 0) {
        addToast({
          title: t("common.warning"),
          message: t("messages.fileEmpty"),
          type: "warning",
        });
        return;
      }

      // Find data row (skip headers)
      const dataRow = findDataRow(jsonData as unknown[][]);

      if (!dataRow || dataRow.length === 0) {
        addToast({
          title: t("common.warning"),
          message: "لم يتم العثور على بيانات صالحة في الملف",
          type: "warning",
        });
        return;
      }

      console.log("Raw data row:", dataRow);

      // Map Excel data to form fields with current structure
      const mappedData = mapExcelDataToForm(dataRow);

      if (!mappedData) {
        addToast({
          title: t("common.error"),
          message: "فشل في قراءة بيانات الملف. تأكد من تنسيق الملف.",
          type: "error",
        });
        return;
      }

      // Validate required fields
      if (
        !mappedData.fullName ||
        !mappedData.nationalId ||
        !mappedData.phoneNumber ||
        !mappedData.email
      ) {
        addToast({
          title: t("common.warning"),
          message:
            "البيانات المطلوبة مفقودة: الاسم، الرقم القومي، رقم الهاتف، البريد الإلكتروني",
          type: "warning",
        });
        return;
      }

      // Populate form with imported data
      populateFormWithExcelData(mappedData);

      console.log("Form populated with Excel data:", mappedData);

      addToast({
        title: t("common.success"),
        message: t("messages.importSuccess", { fileName: file.name }),
        type: "success",
      });
    } catch (error) {
      console.error("Excel import error:", error);
      addToast({
        title: t("common.error"),
        message: `فشل في استيراد الملف: ${error instanceof Error ? error.message : "خطأ غير معروف"}`,
        type: "error",
      });
    } finally {
      console.log("=== EXCEL IMPORT END ===");
      setIsImporting(false);
      e.target.value = "";
    }
  };

  // Helper function to find data row in Excel
  const findDataRow = (jsonData: unknown[][]): string[] => {
    // Look for row that doesn't contain headers
    for (let i = 0; i < Math.min(jsonData.length, 10); i++) {
      const row = jsonData[i];
      if (
        Array.isArray(row) &&
        row.length > 0 &&
        row[0] &&
        typeof row[0] === "string" &&
        row[0].trim()
      ) {
        // Skip rows that look like headers
        const firstCell = row[0].toString().toLowerCase().trim();
        if (
          !firstCell.includes("name") &&
          !firstCell.includes("الاسم") &&
          !firstCell.includes("رقم") &&
          !firstCell.includes("number") &&
          !firstCell.includes("header")
        ) {
          return row as string[];
        }
      }
    }

    // Fallback: use second row if first looks like header
    if (jsonData.length > 1) {
      return jsonData[1] as string[];
    }

    // Last resort: use first row
    return jsonData[0] as string[];
  };

  // Map Excel data to form structure
  const mapExcelDataToForm = (dataRow: string[]): {
    fullName: string;
    nationalId: string;
    gender: "male" | "female";
    phoneNumber: string;
    partyUnit: string;
    email: string;
    membershipNumber: string;
    age: number;
    address: string;
    job: string;
    membershipType: MembershipType;
    religion: "muslim" | "christian";
  } | null => {
    try {
      return {
        fullName: (dataRow[0] as string)?.toString().trim() || "",
        nationalId: (dataRow[1] as string)?.toString().trim() || "",
        gender: parseGenderFromExcel(dataRow[2]),
        religion: parseReligionFromExcel(dataRow[3]),
        age: parseAgeFromExcel(dataRow[4]),
        phoneNumber: (dataRow[5] as string)?.toString().trim() || "",
        email: (dataRow[6] as string)?.toString().trim() || "",
        job: (dataRow[7] as string)?.toString().trim() || "",
        address: (dataRow[8] as string)?.toString().trim() || "",
        partyUnit: parsePartyUnitFromExcel(dataRow[9]),
        membershipNumber: (dataRow[10] as string)?.toString().trim() || "",
        membershipType: parseMembershipTypeFromExcel(dataRow[11]),
      };
    } catch (error) {
      console.error("Error mapping Excel data:", error);
      return null;
    }
  };

  // Helper functions for parsing Excel data
  const parseGenderFromExcel = (value: string): "male" | "female" => {
    const genderStr = value?.toString().trim().toLowerCase();
    if (genderStr === "ذكر" || genderStr === "male" || genderStr === "m") {
      return "male";
    }
    if (genderStr === "أنثى" || genderStr === "female" || genderStr === "f") {
      return "female";
    }
    return "male"; // default
  };

  const parseReligionFromExcel = (value: string): "muslim" | "christian" => {
    const religionStr = value?.toString().trim().toLowerCase();
    if (religionStr === "مسلم" || religionStr === "muslim" || religionStr === "مسلم") {
      return "muslim";
    }
    if (religionStr === "مسيحي" || religionStr === "christian" || religionStr === "مسيحى") {
      return "christian";
    }
    return "muslim"; // default
  };

  const parsePartyUnitFromExcel = (value: string): string => {
    const unitStr = value?.toString().trim();
    const validUnits = ["وراق الحضر", "وراق العرب", "جزيرة محمد", "طناش", "عزبة المفتى", "عزبة الخلايفة"];

    if (validUnits.includes(unitStr)) {
      return unitStr;
    }

    // Default to first option if invalid
    return "وراق الحضر";
  };

  const parseAgeFromExcel = (value: string | number): number => {
    if (typeof value === "number") {
      return Math.max(18, Math.min(80, value));
    }

    const ageStr = value?.toString().trim();
    if (!ageStr) return 18;

    const age = parseInt(ageStr);
    return isNaN(age) ? 18 : Math.max(18, Math.min(80, age));
  };

  const parseMembershipTypeFromExcel = (value: string): MembershipType => {
    const typeStr = value?.toString().trim();
    const typeMap: Record<string, MembershipType> = {
      "عضو عادى": "regular",
      "عضو لجنة": "committee",
      "امين القسم": "divisionSecretary",
      "امين مساعد": "assistantSecretary",
      "امين تنظيم": "organizationSecretary",
      "امين امانة": "secretary",
      "امين مساعد امانة": "assistantSecretaryGeneral",
      "امين وحدة قاعدية": "baseUnitSecretary",
      "امين مساعد وحدة قاعدية": "baseUnitAssistantSecretary",
      "امين تنظيم وحدة قاعدية": "baseUnitOrganizationSecretary",
      "امين أمانة وحدة قاعدية": "baseUnitSecretaryGeneral",
      // English variants
      "regular": "regular",
      "committee": "committee",
      "divisionSecretary": "divisionSecretary",
      "assistantSecretary": "assistantSecretary",
      "organizationSecretary": "organizationSecretary",
      "secretary": "secretary",
      "assistantSecretaryGeneral": "assistantSecretaryGeneral",
      "baseUnitSecretary": "baseUnitSecretary",
      "baseUnitAssistantSecretary": "baseUnitAssistantSecretary",
      "baseUnitOrganizationSecretary": "baseUnitOrganizationSecretary",
      "baseUnitSecretaryGeneral": "baseUnitSecretaryGeneral",
    };
    return typeMap[typeStr] || "regular";
  };

  // Populate form with Excel data
  const populateFormWithExcelData = (data: {
    fullName: string;
    nationalId: string;
    gender: "male" | "female";
    phoneNumber: string;
    partyUnit: string;
    email: string;
    membershipNumber: string;
    age: number;
    address: string;
    job: string;
    membershipType: MembershipType;
    religion: "muslim" | "christian";
  }) => {
    setValue("fullName", data.fullName);
    setValue("nationalId", data.nationalId);
    setValue("gender", data.gender);
    setValue("phoneNumber", data.phoneNumber);
    setValue("partyUnit", data.partyUnit);
    setValue("email", data.email);
    setValue("membershipNumber", data.membershipNumber);
    setValue("age", data.age);
    setValue("address", data.address);
    setValue("job", data.job);
    setValue("membershipType", data.membershipType);
    setValue("religion", data.religion);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPhotoPreview(result);
        setValue("photo", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearForm = () => {
    reset({
      fullName: "",
      nationalId: "",
      gender: "male",
      religion: "muslim",
      phoneNumber: "",
      email: "",
      membershipNumber: "",
      age: 18,
      address: "",
      job: "",
      membershipType: "regular",
      partyUnit: "وراق الحضر",
    });
    setPhotoPreview("");
    setIsEditing(false);
  };

  const genderOptions = [
    { value: "male", label: t("common.male") },
    { value: "female", label: t("common.female") },
  ];

  const religionOptions = [
    { value: "muslim", label: t("common.muslim") },
    { value: "christian", label: t("common.christian") },
  ];

  const partyUnitOptions = [
    { value: "وراق الحضر", label: "وراق الحضر" },
    { value: "وراق العرب", label: "وراق العرب" },
    { value: "جزيرة محمد", label: "جزيرة محمد" },
    { value: "طناش", label: "طناش" },
    { value: "عزبة المفتى", label: "عزبة المفتى" },
    { value: "عزبة الخلايفة", label: "عزبة الخلايفة" },
  ];

  const membershipTypeOptions = [
    { value: "regular", label: t("members.memberTypes.regular") },
    { value: "committee", label: t("members.memberTypes.committee") },
    { value: "divisionSecretary", label: t("members.memberTypes.divisionSecretary") },
    { value: "assistantSecretary", label: t("members.memberTypes.assistantSecretary") },
    { value: "organizationSecretary", label: t("members.memberTypes.organizationSecretary") },
    { value: "secretary", label: t("members.memberTypes.secretary") },
    { value: "assistantSecretaryGeneral", label: t("members.memberTypes.assistantSecretaryGeneral") },
    { value: "baseUnitSecretary", label: t("members.memberTypes.baseUnitSecretary") },
    { value: "baseUnitAssistantSecretary", label: t("members.memberTypes.baseUnitAssistantSecretary") },
    { value: "baseUnitOrganizationSecretary", label: t("members.memberTypes.baseUnitOrganizationSecretary") },
    { value: "baseUnitSecretaryGeneral", label: t("members.memberTypes.baseUnitSecretaryGeneral") },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-dark-background-primary">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 lg:p-8">
          {/* Import/Export Buttons */}
          {!isViewOnly && (
            <AnimatedSection className="flex flex-wrap gap-3 mb-6" delay={0.1}>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleImportExcel}
                  className="hidden"
                  disabled={isImporting}
                  id="excel-import-input"
                />
                <Button
                  variant="outline"
                  size="lg"
                  disabled={isImporting}
                  leftIcon={<Download className="h-5 w-5" />}
                  className="px-6 py-3 text-lg"
                  onClick={() => {
                    console.log("=== IMPORT BUTTON CLICKED ===");
                    console.log("Triggering file input...");
                    document.getElementById("excel-import-input")?.click();
                  }}
                >
                  {t("common.import")}
                </Button>
              </label>
            </AnimatedSection>
          )}

          {/* Header */}
          <AnimatedSection
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0"
            delay={0.2}
          >
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-dark-text-primary">
                {isViewOnly
                  ? t("members.viewMember")
                  : isEditing
                    ? t("members.editMember")
                    : t("members.addMember")}
              </h1>
              <p className="text-gray-600 dark:text-dark-text-secondary mt-2">
                {isViewOnly
                  ? t("members.viewMemberDescription")
                  : t("app.subtitle")}
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
              {isViewOnly && (
                <Button
                  variant="primary"
                  onClick={() => {
                    // Switch to edit mode
                    setIsViewOnly(false);
                    setIsEditing(true);
                    // Update URL to remove view mode
                    navigate(`/entry/${id}`, { replace: true });
                  }}
                  leftIcon={<Edit className="h-4 w-4" />}
                >
                  {t("common.edit")}
                </Button>
              )}
            </div>
          </AnimatedSection>

          {/* Form */}
          <Card className="p-4 lg:p-8">
            {formError && (
              <div className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-300">
                {formError}
              </div>
            )}
            {Object.keys(errors).length > 0 && (
              <div className="mb-4 p-3 rounded bg-yellow-100 text-yellow-800 border border-yellow-300">
                {t("messages.formErrors")}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {isViewOnly && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                    <Eye className="h-5 w-5" />
                    <span className="font-medium">
                      {t("members.viewOnlyMode")}
                    </span>
                  </div>
                  <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                    {t("members.viewOnlyDescription")}
                  </p>
                </div>
              )}
              <AnimatedGroup
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
                staggerDelay={0.05}
                direction="up"
                distance={10}
              >
                <Input
                  label={t("members.fullName")}
                  type="text"
                  placeholder={t("members.fullName")}
                  leftIcon={<User className="h-5 w-5" />}
                  fullWidth
                  required
                  disabled={isViewOnly}
                  {...register("fullName", {
                    required: t("forms.validation.required"),
                    minLength: {
                      value: 3,
                      message: t("forms.validation.minLength", { min: 3 }),
                    },
                  })}
                  error={errors.fullName?.message}
                />

                <Input
                  label={t("members.nationalId")}
                  type="text"
                  placeholder={t("members.nationalId")}
                  leftIcon={<CreditCard className="h-5 w-5" />}
                  fullWidth
                  required
                  disabled={isViewOnly}
                  {...register("nationalId", {
                    required: t("forms.validation.required"),
                    pattern: {
                      value: /^\d{14}$/,
                      message: t("forms.validation.nationalId"),
                    },
                  })}
                  error={errors.nationalId?.message}
                />

                <Select
                  label={t("members.gender")}
                  options={genderOptions}
                  placeholder={t("common.select")}
                  fullWidth
                  required
                  disabled={isViewOnly}
                  {...register("gender", {
                    required: t("forms.validation.required"),
                  })}
                  error={errors.gender?.message}
                />

                <Select
                  label={t("members.religion")}
                  options={religionOptions}
                  placeholder={t("common.select")}
                  fullWidth
                  required
                  disabled={isViewOnly}
                  {...register("religion", {
                    required: t("forms.validation.required"),
                  })}
                  error={errors.religion?.message}
                />

                <Input
                  label={t("members.age")}
                  type="number"
                  placeholder={t("members.age")}
                  leftIcon={<Calendar className="h-5 w-5" />}
                  fullWidth
                  required
                  disabled={isViewOnly}
                  min={18}
                  max={80}
                  {...register("age", {
                    required: t("forms.validation.required"),
                    min: {
                      value: 18,
                      message: t("forms.validation.age"),
                    },
                    max: {
                      value: 80,
                      message: t("forms.validation.age"),
                    },
                  })}
                  error={errors.age?.message}
                />

                <Input
                  label={t("members.phoneNumber")}
                  type="tel"
                  placeholder={t("members.phoneNumber")}
                  leftIcon={<Phone className="h-5 w-5" />}
                  fullWidth
                  required
                  disabled={isViewOnly}
                  {...register("phoneNumber", {
                    required: t("forms.validation.required"),
                    pattern: {
                      value: /^01\d{9}$/,
                      message: t("forms.validation.phone"),
                    },
                  })}
                  error={errors.phoneNumber?.message}
                />

                <Input
                  label={t("members.emailAddress")}
                  type="email"
                  placeholder={t("members.emailAddress")}
                  leftIcon={<Mail className="h-5 w-5" />}
                  fullWidth
                  required
                  disabled={isViewOnly}
                  {...register("email", {
                    required: t("forms.validation.required"),
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: t("forms.validation.email"),
                    },
                  })}
                  error={errors.email?.message}
                />

                <Input
                  label={t("members.job")}
                  type="text"
                  placeholder={t("members.job")}
                  leftIcon={<Building className="h-5 w-5" />}
                  fullWidth
                  required
                  disabled={isViewOnly}
                  {...register("job", {
                    required: t("forms.validation.required"),
                  })}
                  error={errors.job?.message}
                />

                <Input
                  label={t("members.address")}
                  type="text"
                  placeholder={t("members.address")}
                  leftIcon={<MapPin className="h-5 w-5" />}
                  fullWidth
                  required
                  disabled={isViewOnly}
                  {...register("address", {
                    required: t("forms.validation.required"),
                  })}
                  error={errors.address?.message}
                />

                <Select
                  label={t("members.partyUnit")}
                  options={partyUnitOptions}
                  placeholder={t("common.select")}
                  fullWidth
                  required
                  disabled={isViewOnly}
                  {...register("partyUnit", {
                    required: t("forms.validation.required"),
                  })}
                  error={errors.partyUnit?.message}
                />

                <Input
                  label={t("members.membershipNumber")}
                  type="text"
                  placeholder={t("members.membershipNumber")}
                  leftIcon={<User className="h-5 w-5" />}
                  fullWidth
                  required
                  disabled={isViewOnly}
                  {...register("membershipNumber", {
                    required: t("forms.validation.required"),
                  })}
                  error={errors.membershipNumber?.message}
                />

                <Select
                  label={t("members.membershipType")}
                  options={membershipTypeOptions}
                  placeholder={t("common.select")}
                  fullWidth
                  required
                  disabled={isViewOnly}
                  {...register("membershipType", {
                    required: t("forms.validation.required"),
                  })}
                  error={errors.membershipType?.message}
                />
              </AnimatedGroup>

              {/* Photo Upload */}
              <AnimatedSection className="space-y-4" delay={0.4}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("members.memberPhoto")}
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      disabled={isViewOnly}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900 dark:file:text-primary-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  {photoPreview && (
                    <div className="flex items-center space-x-2">
                      <img
                        src={photoPreview}
                        alt={t("members.photoPreview")}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-300 dark:border-gray-600"
                      />
                      {!isViewOnly && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setPhotoPreview("");
                            setValue("photo", undefined);
                          }}
                          leftIcon={<X className="h-4 w-4" />}
                        >
                          {t("common.remove")}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </AnimatedSection>

              {/* Form Actions */}
              {!isViewOnly && (
                <AnimatedSection
                  className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-3 sm:space-y-0 pt-6 border-t border-gray-200 dark:border-gray-700"
                  delay={0.5}
                >
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={clearForm}
                    leftIcon={<X className="h-4 w-4" />}
                  >
                    {t("members.clearForm")}
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    leftIcon={<Save className="h-4 w-4" />}
                  >
                    {isEditing ? t("common.save") : t("members.saveMember")}
                  </Button>
                </AnimatedSection>
              )}
            </form>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default DataEntryForm;
