import { CsvService } from "./enhancedCsvService";
import type { Member, MemberFilters, MemberStats } from "../types/member";

/**
 * خدمة التخزين المحلي - غلاف لخدمة CSV
 * تستخدم CsvService للعمليات الأساسية
 */
export class LocalStorageService {
  private static csvService = CsvService.getInstance();

  /**
   * مسح جميع البيانات
   */
  static async clearAllData(): Promise<void> {
    await this.csvService.clearAllData();
  }

  /**
   * Add new member
   */
  static async addMember(member: Member): Promise<boolean> {
    return await this.csvService.addMember(member);
  }

  /**
   * الحصول على جميع الأعضاء
   */
  static async getAllMembers(): Promise<Member[]> {
    return await this.csvService.getAllMembers();
  }

  /**
   * حذف عضو
   */
  static async deleteMember(id: string): Promise<boolean> {
    return await this.csvService.deleteMember(id);
  }

  /**
   * تحديث عضو
   */
  static async updateMember(
    id: string,
    updates: Partial<Member>,
  ): Promise<boolean> {
    return await this.csvService.updateMember(id, updates);
  }

  /**
   * البحث في الأعضاء
   */
  static async searchMembers(query: string): Promise<Member[]> {
    return await this.csvService.searchMembers(query);
  }

  /**
   * تصفية الأعضاء
   */
  static async filterMembers(filters: MemberFilters): Promise<Member[]> {
    return await this.csvService.filterMembers(filters);
  }

  /**
   * الحصول على إحصائيات الأعضاء
   */
  static async getMemberStats(): Promise<MemberStats> {
    return await this.csvService.getMemberStats();
  }
}
