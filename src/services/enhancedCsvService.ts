import type { Member, MemberStats, MemberFilters } from '../types/member';

// Define types for File System Access API
interface FilePickerOptions {
  types?: Array<{
    description: string;
    accept: Record<string, string[]>;
  }>;
  multiple?: boolean;
  suggestedName?: string;
}

interface FileSystemFileHandle {
  getFile(): Promise<File>;
  createWritable(): Promise<FileSystemWritableFileStream>;
}

// Extend Window interface for File System Access API
declare global {
  interface Window {
    showOpenFilePicker?: (options?: FilePickerOptions) => Promise<FileSystemFileHandle[]>;
  }
}

export class CsvService {
  private static instance: CsvService;
  private readonly STORAGE_KEY = "members_csv_file_handle";
  private currentMembers: Member[] = [];

  private constructor() {
    this.initializeFileHandle();
  }

  static getInstance(): CsvService {
    if (!CsvService.instance) {
      CsvService.instance = new CsvService();
    }
    return CsvService.instance;
  }

  private async initializeFileHandle(): Promise<void> {
    try {
      // Try to load existing file handle from localStorage
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        // Note: File handles cannot be persisted across sessions in browsers
        // We'll need to prompt user to select file each time
        console.log('File handle data found in localStorage but cannot be restored across sessions');
      }

      // Load members from localStorage as fallback
      const storedMembers = localStorage.getItem('members_data');
      if (storedMembers) {
        this.currentMembers = JSON.parse(storedMembers);
      }
    } catch (error) {
      console.error('Error initializing file handle:', error);
    }
  }

  // Request user to select CSV file
  async selectCsvFile(): Promise<boolean> {
    try {
      if ('showOpenFilePicker' in window && window.showOpenFilePicker) {
        // Use File System Access API for modern browsers
        const fileHandles = await window.showOpenFilePicker({
          types: [{
            description: 'CSV Files',
            accept: { 'text/csv': ['.csv'] }
          }],
          multiple: false
        });

        const fileHandle = fileHandles[0];
        if (fileHandle) {
          const file = await fileHandle.getFile();
          const content = await file.text();

          this.currentMembers = this.parseCsvContent(content);

          // Save to localStorage as backup
          localStorage.setItem('members_data', JSON.stringify(this.currentMembers));
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
            name: file.name,
            lastModified: file.lastModified
          }));

          return true;
        }
      } else {
        // Fallback for browsers without File System Access API
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';

        return new Promise((resolve) => {
          input.onchange = async (e: Event) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
              const content = await file.text();
              this.currentMembers = this.parseCsvContent(content);

              // Save to localStorage as backup
              localStorage.setItem('members_data', JSON.stringify(this.currentMembers));
              localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
                name: file.name,
                lastModified: file.lastModified
              }));

              resolve(true);
            } else {
              resolve(false);
            }
          };
          input.click();
        });
      }
      return false;
    } catch (error) {
      console.error('Error selecting CSV file:', error);
      return false;
    }
  }

  // Save current members to CSV file - DISABLED
  async saveToCsvFile(): Promise<boolean> {
    // CSV export feature has been disabled
    console.log('CSV export is disabled');
    return true;
  }

  // Helper method to parse CSV content
  private parseCsvContent(csvContent: string): Member[] {
    const lines = csvContent.trim().split('\n');
    if (lines.length <= 1) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const members: Member[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCsvLine(lines[i]);
      if (values.length >= headers.length) {
        const member: Partial<Member> = {};
        headers.forEach((header, index) => {
          if (values[index] !== undefined && values[index] !== '') {
            const key = header as keyof Member;
            (member as Record<string, unknown>)[key] = values[index];
          }
        });

        // Convert types
        if (member.age && typeof member.age === 'string') member.age = parseInt(member.age, 10);
        if (member.registrationDate && typeof member.registrationDate === 'string') member.registrationDate = new Date(member.registrationDate).toISOString();
        if (member.createdAt && typeof member.createdAt === 'string') member.createdAt = new Date(member.createdAt).toISOString();
        if (member.updatedAt && typeof member.updatedAt === 'string') member.updatedAt = new Date(member.updatedAt).toISOString();

        // Set default values for optional fields
        member.photo = member.photo || '';
        member.landlineNumber = member.landlineNumber || '';
        member.registrationDate = member.registrationDate || new Date().toISOString();
        member.createdAt = member.createdAt || new Date().toISOString();
        member.updatedAt = member.updatedAt || new Date().toISOString();

        members.push(member as Member);
      }
    }

    return members;
  }

  // Helper method to parse a single CSV line
  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  }

  // Get all members from current data
  async getAllMembers(): Promise<Member[]> {
    if (this.currentMembers.length === 0) {
      // Try to load from localStorage backup
      const stored = localStorage.getItem('members_data');
      if (stored) {
        this.currentMembers = JSON.parse(stored);
      }
    }
    return [...this.currentMembers];
  }

  // Get member by ID
  async getMemberById(id: string): Promise<Member | null> {
    const members = await this.getAllMembers();
    return members.find(member => member.id === id) || null;
  }

  // Add a new member
  async addMember(member: Member): Promise<boolean> {
    try {
      // Check for duplicates
      if (await this.checkForDuplicates(member)) {
        return false;
      }

      this.currentMembers.push(member);

      // Save to localStorage as backup
      localStorage.setItem('members_data', JSON.stringify(this.currentMembers));

      // CSV export has been disabled
      console.log('Member added successfully (CSV export disabled)');

      return true;
    } catch (error) {
      console.error('Error adding member:', error);
      return false;
    }
  }

  // Update a member
  async updateMember(id: string, updates: Partial<Member>): Promise<boolean> {
    try {
      const index = this.currentMembers.findIndex(m => m.id === id);
      if (index === -1) return false;

      const updated = {
        ...this.currentMembers[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      // Check for duplicates (excluding current member)
      if (await this.checkForDuplicates(updated, id)) {
        return false;
      }

      this.currentMembers[index] = updated;

      // Save to localStorage as backup
      localStorage.setItem('members_data', JSON.stringify(this.currentMembers));

      // CSV export has been disabled
      console.log('Member updated successfully (CSV export disabled)');

      return true;
    } catch (error) {
      console.error('Error updating member:', error);
      return false;
    }
  }

  // Delete a member
  async deleteMember(id: string): Promise<boolean> {
    try {
      const initialLength = this.currentMembers.length;
      this.currentMembers = this.currentMembers.filter(m => m.id !== id);

      if (this.currentMembers.length === initialLength) {
        return false; // Member not found
      }

      // Save to localStorage as backup
      localStorage.setItem('members_data', JSON.stringify(this.currentMembers));

      // CSV export has been disabled
      console.log('Member deleted successfully (CSV export disabled)');

      return true;
    } catch (error) {
      console.error('Error deleting member:', error);
      return false;
    }
  }

  // Search members
  async searchMembers(query: string): Promise<Member[]> {
    const members = await this.getAllMembers();
    const lowerQuery = query.toLowerCase();

    return members.filter(member =>
      member.fullName.toLowerCase().includes(lowerQuery) ||
      member.nationalId.includes(query) ||
      member.email.toLowerCase().includes(lowerQuery) ||
      member.membershipNumber.includes(query) ||
      member.phoneNumber.includes(query) ||
      (member.address && member.address.toLowerCase().includes(lowerQuery)) ||
      (member.partyUnit && member.partyUnit.toLowerCase().includes(lowerQuery)) ||
      (member.job && member.job.toLowerCase().includes(lowerQuery))
    );
  }

  // Filter members
  async filterMembers(filters: MemberFilters): Promise<Member[]> {
    const members = await this.getAllMembers();

    return members.filter(member => {
      if (filters.gender && filters.gender !== 'all' && member.gender !== filters.gender) {
        return false;
      }
      if (filters.membershipType && filters.membershipType !== 'all' && member.membershipType !== filters.membershipType) {
        return false;
      }
      if (filters.partyUnit && filters.partyUnit !== 'all' && member.partyUnit !== filters.partyUnit) {
        return false;
      }
      if (filters.ageMin && member.age < filters.ageMin) {
        return false;
      }
      if (filters.ageMax && member.age > filters.ageMax) {
        return false;
      }
      return true;
    });
  }

  // Get member statistics
  async getMemberStats(): Promise<MemberStats> {
    const members = await this.getAllMembers();
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      totalMembers: members.length,
      maleMembers: members.filter(m => m.gender === 'male').length,
      femaleMembers: members.filter(m => m.gender === 'female').length,
      recentRegistrations: members.filter(m => new Date(m.registrationDate) >= thirtyDaysAgo).length,
    };
  }

  // Check for duplicates (excluding current member)
  private async checkForDuplicates(member: Member, excludeId?: string): Promise<boolean> {
    const membersToCheck = excludeId
      ? this.currentMembers.filter(m => m.id !== excludeId)
      : this.currentMembers;

    return membersToCheck.some(m =>
      m.nationalId === member.nationalId ||
      m.email === member.email ||
      m.phoneNumber === member.phoneNumber ||
      m.membershipNumber === member.membershipNumber
    );
  }

  // Export members to CSV format - DISABLED
  exportToCsv(): string {
    // CSV export feature has been disabled
    console.log('CSV export is disabled');
    return '';
  }

  // Import from Excel (using same logic as CSV)
  async importFromExcel(members: Member[]): Promise<{ success: number; errors: string[]; duplicates: number }> {
    const errors: string[] = [];
    let successCount = 0;
    let duplicateCount = 0;

    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      try {
        // Validate required fields
        if (!member.fullName || !member.nationalId || !member.email || !member.phoneNumber || !member.membershipNumber) {
          errors.push(`الصف ${i + 1}: الحقول المطلوبة مفقودة (الاسم، الرقم القومي، البريد الإلكتروني، رقم الهاتف، رقم العضوية)`);
          continue;
        }

        // Validate national ID format (14 digits)
        if (!/^\d{14}$/.test(member.nationalId)) {
          errors.push(`الصف ${i + 1}: تنسيق الرقم القومي غير صحيح (يجب أن يكون 14 رقم)`);
          continue;
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
          errors.push(`الصف ${i + 1}: تنسيق البريد الإلكتروني غير صحيح`);
          continue;
        }

        // Validate phone number format (01xxxxxxxxx)
        if (!/^01\d{9}$/.test(member.phoneNumber)) {
          errors.push(`الصف ${i + 1}: تنسيق رقم الهاتف غير صحيح (يجب أن يبدأ بـ 01 ويكون 11 رقم)`);
          continue;
        }

        // Validate age range (18-80)
        if (member.age < 18 || member.age > 80) {
          errors.push(`الصف ${i + 1}: العمر يجب أن يكون بين 18 و 80 سنة`);
          continue;
        }

        // Check for duplicates
        if (await this.checkForDuplicates(member)) {
          duplicateCount++;
          errors.push(`الصف ${i + 1}: بيانات مكررة (رقم قومي، بريد إلكتروني، رقم هاتف، أو رقم عضوية)`);
          continue;
        }

        // Add member
        this.currentMembers.push(member);
        successCount++;
      } catch (error) {
        errors.push(`الصف ${i + 1}: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
      }
    }

    if (successCount > 0) {
      // Save to localStorage only - CSV export disabled
      localStorage.setItem('members_data', JSON.stringify(this.currentMembers));
    }

    return { success: successCount, errors, duplicates: duplicateCount };
  }

  // Database maintenance (no-op for CSV files)
  async vacuum(): Promise<void> {
    console.log('Vacuum operation not needed for CSV files');
  }

  // Get database size (approximate) - DISABLED
  async getDatabaseSize(): Promise<number> {
    // CSV export feature has been disabled
    console.log('CSV export is disabled');
    return 0;
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    this.currentMembers = [];
    localStorage.removeItem('members_data');
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
