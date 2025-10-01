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
        "رقم الهاتف": member.phoneNumber,
        "الوحدة الحزبية": member.partyUnit || "",
        "البريد الإلكتروني": member.email,
        "رقم العضوية": member.membershipNumber,
        العمر: member.age,
        العنوان: member.address,
        الوظيفة: member.job,
        "حالة العضو":
          member.status === "active"
            ? "نشط"
            : member.status === "inactive"
              ? "غير نشط"
              : "معلق",
        "نوع العضوية": this.getMembershipTypeText(member.membershipType),
        "الدعم المالي":
          member.financialSupport === "paid" ? "مدفوع" : "غير مدفوع",
        "تاريخ التسجيل": new Date(member.registrationDate).toLocaleDateString(
          "ar-EG",
        ),
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      worksheet["!cols"] = [
        { wch: 20 },
        { wch: 15 },
        { wch: 8 },
        { wch: 15 },
        { wch: 15 },
        { wch: 25 },
        { wch: 12 },
        { wch: 6 },
        { wch: 30 },
        { wch: 20 },
        { wch: 12 },
        { wch: 25 },
        { wch: 12 },
        { wch: 15 },
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
        "رقم الهاتف": "01234567890",
        "الوحدة الحزبية": "وراق الحضر",
        "البريد الإلكتروني": "example@email.com",
        "رقم العضوية": "M001",
        العمر: "25",
        العنوان: "مثال: القاهرة، مصر",
        الوظيفة: "مثال: مهندس",
        "حالة العضو": "نشط",
        "نوع العضوية": "عضو عادى",
        "الدعم المالي": "مدفوع",
        "تاريخ التسجيل": new Date().toLocaleDateString("ar-EG"),
      },
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    worksheet["!cols"] = [
      { wch: 20 },
      { wch: 15 },
      { wch: 8 },
      { wch: 15 },
      { wch: 15 },
      { wch: 25 },
      { wch: 12 },
      { wch: 6 },
      { wch: 30 },
      { wch: 20 },
      { wch: 12 },
      { wch: 25 },
      { wch: 12 },
      { wch: 15 },
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
      partyUnit: ["الوحدة الحزبية", "Party Unit"],
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
    const partyUnit = findFieldValue(fieldMappings.partyUnit);

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

    return {
      id: `imported_${Date.now()}_${index}`,
      fullName,
      nationalId: cleanNationalId,
      gender: "male",
      phoneNumber: cleanPhoneNumber,
      partyUnit: partyUnit || undefined,
      email,
      membershipNumber: `M${Date.now()}${index}`,
      age: 18,
      address: "",
      job: "",
      status: "active",
      membershipType: "regular",
      financialSupport: "unpaid",
      registrationDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private static getMembershipTypeText(type: string): string {
    const typeMap: Record<string, string> = {
      regular: "عضو عادى",
      committee: "عضو لجنة",
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
