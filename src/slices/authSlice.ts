import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface User {
  username: string;
  password: string;
  role: "admin" | "user";
  permissions: string[];
  displayName: string;
  displayNameEn: string;
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
  loginAttempts: number;
  lastLoginAttempt: number | null;
  isLoading: boolean;
  error: string | null;
}

// نظام الحسابات والصلاحيات
const users: User[] = [
  {
    username: "Hawary",
    password: "Alfa404",
    role: "admin",
    displayName: "هواري",
    displayNameEn: "Hawary",
    permissions: ["read", "write", "delete", "export", "import", "admin"],
  },
  {
    username: "Tamer.AyoB",
    password: "Alfa404",
    role: "admin",
    displayName: "تامر أيوب",
    displayNameEn: "Tamer Ayoub",
    permissions: ["read", "write", "delete", "export", "import", "admin"],
  },
  {
    username: "UserName1",
    password: "123456",
    role: "user",
    displayName: "مستخدم 1",
    displayNameEn: "User 1",
    permissions: ["read", "write", "export", "import"],
  },
  {
    username: "UserName2",
    password: "123456",
    role: "user",
    displayName: "مستخدم 2",
    displayNameEn: "User 2",
    permissions: ["read", "write", "export", "import"],
  },
  {
    username: "UserName3",
    password: "123456",
    role: "user",
    displayName: "مستخدم 3",
    displayNameEn: "User 3",
    permissions: ["read", "write", "export", "import"],
  },
  {
    username: "admin",
    password: "admin",
    role: "admin",
    displayName: "مدير النظام",
    displayNameEn: "System Administrator",
    permissions: ["read", "write", "delete", "export", "import", "admin"],
  },
];

// دالة للتحقق من صحة بيانات تسجيل الدخول
export const authenticateUser = (
  username: string,
  password: string,
): User | null => {
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );
  return user || null;
};

// دالة لتوليد توكن آمن
export const generateToken = (username: string): string => {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `token-${username}-${timestamp}-${randomPart}`;
};

// دالة لاستخراج الطابع الزمني من التوكن
export const extractTokenTimestamp = (token: string): number | null => {
  try {
    const parts = token.split('-');
    if (parts.length >= 3 && parts[0] === 'token') {
      return parseInt(parts[2], 10);
    }
    return null;
  } catch {
    return null;
  }
};

// دالة للتحقق من انتهاء صلاحية الجلسة (24 ساعة)
export const isSessionExpired = (token: string): boolean => {
  const timestamp = extractTokenTimestamp(token);
  if (!timestamp) return true; // إذا لم نتمكن من استخراج الطابع الزمني، اعتبر الجلسة منتهية الصلاحية

  const now = Date.now();
  const sessionAge = now - timestamp;
  const maxAge = 24 * 60 * 60 * 1000; // 24 ساعة بالميلي ثانية
  return sessionAge > maxAge;
};

// دالة للتحقق من صحة البيانات المحفوظة في localStorage
export const validateStoredSession = (): {
  token: string | null;
  user: User | null;
} => {
  try {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("currentUser");

    if (!token || !userStr) {
      return { token: null, user: null };
    }

    // التحقق من صحة التوكن وانتهاء صلاحيته
    if (isSessionExpired(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      return { token: null, user: null };
    }

    const user = JSON.parse(userStr) as User;

    // التحقق من صحة البيانات
    if (!user || !user.username || !user.role) {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      return { token: null, user: null };
    }

    return { token, user };
  } catch (error) {
    console.error("Error validating stored session:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    return { token: null, user: null };
  }
};

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  user: null,
  loginAttempts: 0,
  lastLoginAttempt: null,
  isLoading: false,
  error: null,
};

// التحقق من وجود جلسة محفوظة عند بدء التطبيق
const storedSession = validateStoredSession();
if (
  storedSession.token &&
  storedSession.user &&
  !isSessionExpired(storedSession.token)
) {
  initialState.token = storedSession.token;
  initialState.isAuthenticated = true;
  initialState.user = storedSession.user;
  initialState.lastLoginAttempt = Date.now();
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    login(state, action: PayloadAction<{ token: string; user: User }>) {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.loginAttempts = 0;
      state.lastLoginAttempt = Date.now();
      state.isLoading = false;
      state.error = null;

      // حفظ البيانات في localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("currentUser", JSON.stringify(action.payload.user));
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.isAuthenticated = false;
      state.user = null;
      state.loginAttempts += 1;
      state.lastLoginAttempt = Date.now();
      state.isLoading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      state.loginAttempts = 0;
      state.lastLoginAttempt = null;
      state.isLoading = false;
      state.error = null;

      // مسح البيانات من localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { login, loginStart, loginFailure, logout, clearError } =
  authSlice.actions;

// دالة للتحقق من وجود جلسة محفوظة وإعادتها
export const checkStoredSession = () => {
  try {
    const storedSession = validateStoredSession();
    if (
      storedSession.token &&
      storedSession.user &&
      !isSessionExpired(storedSession.token)
    ) {
      console.log("🔐 Valid stored session found for user:", storedSession.user.username);
      return {
        type: "auth/login",
        payload: { token: storedSession.token, user: storedSession.user },
      };
    }
    if (storedSession.token || storedSession.user) {
      console.log("🔓 Stored session is invalid or expired");
    }
    return { type: "auth/logout" };
  } catch (error) {
    console.error("❌ Error checking stored session:", error);
    return { type: "auth/logout" };
  }
};

export default authSlice.reducer;
