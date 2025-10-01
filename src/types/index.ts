/**
 * تعريفات الأنواع الشاملة للتطبيق
 * @fileoverview يحتوي على جميع تعريفات الأنواع المستخدمة في التطبيق
 */

import type { Member, MemberFilters, MemberStats } from "./member";

/**
 * تعريفات الأنواع العامة للتطبيق
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

/**
 * تعريفات حالات الاستجابة من API
 */
export type LoadingState = "idle" | "loading" | "success" | "error";

export interface AsyncState<T = unknown> {
  data: T | null;
  status: LoadingState;
  error: string | null;
}

/**
 * تعريفات المستخدم والمصادقة
 */
export interface User {
  id: string;
  username: string;
  role: "admin" | "user" | "viewer";
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loginTime: number | null;
}

/**
 * تعريفات الإعدادات
 */
export interface AppSettings {
  theme: "light" | "dark" | "auto";
  language: "ar" | "en";
  notifications: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
  };
  data: {
    autoSave: boolean;
    backupFrequency: "daily" | "weekly" | "monthly";
  };
}

/**
 * تعريفات الأحداث والنشاطات
 */
export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: "member" | "setting" | "system";
  entityId?: string;
  details?: Record<string, unknown>;
  timestamp: string;
  ipAddress?: string;
}

/**
 * تعريفات التقارير والإحصائيات
 */
export interface DashboardStats {
  members: MemberStats;
  activities: {
    totalActivities: number;
    todayActivities: number;
    recentActivities: ActivityLog[];
  };
  system: {
    lastBackup?: string;
    storageUsed: number;
    totalFiles: number;
  };
}

/**
 * تعريفات ملفات الاستيراد والتصدير
 */
export interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: Array<{
    row: number;
    message: string;
    data?: unknown;
  }>;
}

export interface ExportOptions {
  format: "csv" | "excel" | "pdf";
  includeHeaders: boolean;
  filters?: MemberFilters;
  selectedFields?: string[];
}

/**
 * تعريفات الأخطاء المخصصة
 */
export class AppError extends Error {
  public readonly code?: string;
  public readonly statusCode?: number;
  public readonly details?: unknown;

  constructor(
    message: string,
    code?: string,
    statusCode?: number,
    details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
    this.field = field;
  }
}

export class NetworkError extends AppError {
  public readonly statusCode?: number;

  constructor(message: string, statusCode?: number) {
    const code = statusCode || 0;
    super(message, "NETWORK_ERROR", code);
    this.name = "NetworkError";
    this.statusCode = statusCode;
  }
}

/**
 * تعريفات الاستجابة من API
 */
export type ApiMemberResponse = ApiResponse<Member[]>;
export type ApiMemberStatsResponse = ApiResponse<MemberStats>;
export type ApiImportResponse = ApiResponse<ImportResult>;
export type ApiExportResponse = ApiResponse<Blob>;

/**
 * تعريفات الاستعلامات والطلبات
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * تعريفات التنقل والمسارات
 */
export interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
  children?: NavigationItem[];
  permissions?: string[];
}

/**
 * تعريفات المكونات
 */
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  "data-testid"?: string;
}

export interface LoadingProps extends BaseComponentProps {
  size?: "small" | "medium" | "large";
  text?: string;
}

/**
 * تعريفات السياق العام
 */
export interface AppContextValue {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  isOnline: boolean;
  version: string;
}

/**
 * تعريفات الاختبارات
 */
export interface TestData {
  members: Member[];
  users: User[];
  settings: AppSettings;
}

/**
 * تعريفات البيئة
 */
export interface EnvironmentVariables {
  API_URL: string;
  APP_VERSION: string;
  NODE_ENV: "development" | "production" | "test";
  ENABLE_ANALYTICS: boolean;
  MAX_FILE_SIZE: number;
}

/**
 * تعريفات النسخ الاحتياطي
 */
export interface BackupConfig {
  enabled: boolean;
  schedule: "daily" | "weekly" | "monthly";
  retentionDays: number;
  location: "local" | "cloud";
  encryption: boolean;
}

export interface BackupResult {
  success: boolean;
  filePath?: string;
  fileSize?: number;
  timestamp: string;
  error?: string;
}
