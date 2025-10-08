import * as XLSX from "xlsx";
import type { Member } from "../types/member";

export class ExcelService {
  // Export members to Excel
  static async exportToExcel(
    members: Member[],
    filename: string = "أعضاء_الحزب.xlsx",
  ): Promise<void> {
    this.exportMembers(members, filename);
  }

  static exportMembers(
    members: Member[],
    filename: string = "أعضاء_الحزب.xlsx",
  ): void {
    try {
      const workbook = XLSX.utils.book_new();
      const exportData = members.map((member) => ({
        "الاسم بالكامل": member.fullName,
        "الرقم القومي": member.nationalId,
        الجنس: member.gender === "male" ? "ذكر" : "أنثى",
        الديانة: member.religion === "muslim" ? "مسلم" : "مسيحي",
        العمر: member.age,
        "رقم الهاتف": member.phoneNumber,
        "البريد الإلكتروني": member.email,
        الوظيفة: member.job,
        العنوان: member.address,
        "الوحدة الحزبية": member.partyUnit || "",
        "رقم العضوية": member.membershipNumber,
        "نوع العضوية": this.getMembershipTypeText(member.membershipType),
        "تاريخ التسجيل": new Date(member.registrationDate).toLocaleDateString(
          "ar-EG",
        ),
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      worksheet["!cols"] = [
        { wch: 20 }, // الاسم بالكامل
        { wch: 15 }, // الرقم القومي
        { wch: 8 },  // الجنس
        { wch: 10 }, // الديانة
        { wch: 6 },  // العمر
        { wch: 15 }, // رقم الهاتف
        { wch: 25 }, // البريد الإلكتروني
        { wch: 20 }, // الوظيفة
        { wch: 30 }, // العنوان
        { wch: 15 }, // الوحدة الحزبية
        { wch: 12 }, // رقم العضوية
        { wch: 12 }, // نوع العضوية
        { wch: 15 }, // تاريخ التسجيل
      ];

      XLSX.utils.book_append_sheet(workbook, worksheet, "أعضاء الحزب");
      XLSX.writeFile(workbook, filename);
    } catch {
      throw new Error("فشل في تصدير البيانات");
    }
  }

  static async importMembers(file: File): Promise<Member[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const data = new Uint8Array(
            (e.target?.result as ArrayBufferLike) || new ArrayBuffer(0),
          );
          const workbook = XLSX.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          if (!jsonData || jsonData.length === 0) {
            throw new Error("الملف فارغ أو لا يحتوي على بيانات");
          }

          const members: Member[] = [];
          (jsonData as Record<string, unknown>[]).forEach(
            (row: Record<string, unknown>, index: number) => {
              try {
                const member = this.parseMemberFromExcel(row, index);
                members.push(member);
              } catch (error) {
                console.error(`Error parsing row ${index + 1}:`, error);
              }
            },
          );

          if (members.length === 0) {
            reject(new Error("لم يتم العثور على بيانات صحيحة في الملف"));
          } else {
            resolve(members);
          }
        } catch (error) {
          reject(
            new Error(
              `فشل في استيراد البيانات: ${error instanceof Error ? error.message : "خطأ غير معروف"}`,
            ),
          );
        }
      };
      reader.onerror = () => reject(new Error("فشل في قراءة الملف"));
      reader.readAsArrayBuffer(file);
    });
  }

  static createTemplate(): void {
    const templateData = [
      {
        "الاسم بالكامل": "مثال: أحمد محمد علي",
        "الرقم القومي": "12345678901234",
        الجنس: "ذكر",
        الديانة: "مسلم",
        العمر: "25",
        "رقم الهاتف": "01234567890",
        "البريد الإلكتروني": "example@email.com",
        الوظيفة: "مثال: مهندس",
        العنوان: "مثال: القاهرة، مصر",
        "الوحدة الحزبية": "وراق الحضر",
        "رقم العضوية": "M001",
        "نوع العضوية": "عضو عادى",
        "تاريخ التسجيل": new Date().toLocaleDateString("ar-EG"),
      },
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    worksheet["!cols"] = [
      { wch: 20 }, // الاسم بالكامل
      { wch: 15 }, // الرقم القومي
      { wch: 8 },  // الجنس
      { wch: 10 }, // الديانة
      { wch: 6 },  // العمر
      { wch: 15 }, // رقم الهاتف
      { wch: 25 }, // البريد الإلكتروني
      { wch: 20 }, // الوظيفة
      { wch: 30 }, // العنوان
      { wch: 15 }, // الوحدة الحزبية
      { wch: 12 }, // رقم العضوية
      { wch: 12 }, // نوع العضوية
      { wch: 15 }, // تاريخ التسجيل
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "قالب_أعضاء_الحزب");
    XLSX.writeFile(workbook, "قالب_استيراد_أعضاء_الحزب.xlsx");
  }

  private static parseMemberFromExcel(
    row: Record<string, unknown>,
    index: number,
  ): Member {
    const fieldMappings = {
      fullName: ["الاسم بالكامل", "الاسم", "Full Name", "Name"],
      nationalId: ["الرقم القومي", "National ID"],
      email: ["البريد الإلكتروني", "Email"],
      phoneNumber: ["رقم الهاتف", "Phone"],
      landlineNumber: ["رقم الهاتف الأرضي", "Landline"],
      partyUnit: ["الوحدة الحزبية", "Party Unit"],
      religion: ["الديانة", "Religion"],
    };

    const findFieldValue = (possibleNames: string[]): string => {
      for (const name of possibleNames) {
        if (row[name]) return row[name].toString().trim();
      }
      return "";
    };

    const fullName = findFieldValue(fieldMappings.fullName);
    const nationalId = findFieldValue(fieldMappings.nationalId);
    const email = findFieldValue(fieldMappings.email);
    const phoneNumber = findFieldValue(fieldMappings.phoneNumber);
    const landlineNumber = findFieldValue(fieldMappings.landlineNumber);
    const partyUnit = findFieldValue(fieldMappings.partyUnit);
    const religion = findFieldValue(fieldMappings.religion);

    if (!fullName || !nationalId || !email || !phoneNumber) {
      throw new Error("الحقول المطلوبة مفقودة");
    }

    const cleanNationalId = nationalId.replace(/\D/g, "");
    if (cleanNationalId.length !== 14) {
      throw new Error("الرقم القومي يجب أن يكون 14 رقم");
    }

    const cleanPhoneNumber = phoneNumber.replace(/\D/g, "");
    if (!/^01\d{9}$/.test(cleanPhoneNumber)) {
      throw new Error("رقم الهاتف غير صحيح");
    }

    // تحقق من الديانة
    const cleanReligion = religion.toLowerCase();
    if (!["مسلم", "مسيحي", "muslim", "christian"].includes(cleanReligion)) {
      throw new Error("الديانة يجب أن تكون مسلم أو مسيحي");
    }

    return {
      id: `imported_${Date.now()}_${index}`,
      fullName,
      nationalId: cleanNationalId,
      gender: "male",
      phoneNumber: cleanPhoneNumber,
      landlineNumber: landlineNumber || undefined,
      partyUnit: partyUnit || undefined,
      email,
      membershipNumber: `M${Date.now()}${index}`,
      age: 18,
      address: "",
      job: "",
      membershipType: "regular",
      religion: cleanReligion.includes("مسلم") || cleanReligion === "muslim" ? "muslim" : "christian",
      registrationDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private static getMembershipTypeText(type: string): string {
    const typeMap: Record<string, string> = {
      regular: "عضو عادى",
      committee: "عضو لجنة",
      divisionSecretary: "أمين شعبة",
      assistantSecretary: "امين مساعد",
      organizationSecretary: "امين تنظيم",
      secretary: "امين امانة",
      assistantSecretaryGeneral: "امين مساعد امانة",
      baseUnitSecretary: "امين وحدة قاعدية",
      baseUnitAssistantSecretary: "امين مساعد وحدة قاعدية",
      baseUnitOrganizationSecretary: "امين تنظيم وحدة قاعدية",
      baseUnitSecretaryGeneral: "امين أمانة وحدة قاعدية",
      premium: "عضو مميز",
      vip: "عضو VIP",
    };
    return typeMap[type] || type;
  }
}
