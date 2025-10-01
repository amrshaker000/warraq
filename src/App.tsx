import { Routes, Route, Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import type { RootState } from "./store";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./views/Home";
import MembersTable from "./views/MembersTable";
import DataEntryForm from "./views/DataEntryForm";
import Analytics from "./views/Analytics";
import Login from "./views/Login";
import BackupPage from "./views/BackupPage";
import SettingsPage from "./views/SettingsPage";
import DebugAuth from "./views/DebugAuth";
import PageTransitionWrapper from "./components/animations/PageTransitionWrapper";
import {
  validateStoredSession,
  isSessionExpired,
  login,
  logout,
} from "./slices/authSlice";

/**
 * مكون المسار الخاص - يحمي المسارات التي تحتاج إلى مصادقة
 *
 * @param children - المكونات الفرعية التي ستُعرض إذا كان المستخدم مصادقاً عليها
 * @returns إما المكونات الفرعية أو إعادة توجيه إلى صفحة تسجيل الدخول
 *
 * @example
 * ```tsx
 * <PrivateRoute>
 *   <Dashboard />
 * </PrivateRoute>
 * ```
 */
function PrivateRoute({ children }: { children: ReactElement }): ReactElement {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

/**
 * مكون التطبيق الرئيسي - نقطة البداية للتطبيق
 *
 * يتولى هذا المكون:
 * - إدارة حالة المصادقة والجلسات
 * - توجيه المستخدمين إلى المسارات المناسبة
 * - حماية المسارات الخاصة
 * - التعامل مع الأخطاء العامة
 *
 * @returns JSX للتطبيق مع جميع المسارات المحددة
 *
 * @example
 * ```tsx
 * import App from './App';
 *
 * function Root() {
 *   return <App />;
 * }
 * ```
 */
function App(): ReactElement {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const dispatch = useDispatch();

  /**
   * التحقق من وجود جلسة محفوظة عند بدء التطبيق
   * يستعيد الجلسة إذا كانت صالحة، ويقوم بتسجيل الخروج إذا كانت منتهية الصلاحية
   */
  useEffect(() => {
    const storedSession = validateStoredSession();

    if (
      storedSession.token &&
      storedSession.user &&
      !isSessionExpired(Date.now())
    ) {
      // استعادة الجلسة الصالحة
      dispatch(login({ token: storedSession.token, user: storedSession.user }));
    } else {
      // تسجيل الخروج إذا كانت الجلسة غير صالحة
      dispatch(logout());
    }
  }, [dispatch]);

  /**
   * منطق إعادة التوجيه التلقائي لتحسين تجربة المستخدم
   * يعيد توجيه المستخدمين المصادق عليهم بعيداً عن صفحة تسجيل الدخول
   */
  useEffect(() => {
    // إعادة توجيه المستخدمين المصادق عليهم بعيداً عن صفحة تسجيل الدخول
    if (isAuthenticated && window.location.pathname === "/login") {
      window.history.replaceState(null, "", "/home");
    }
  }, [isAuthenticated]);

  return (
    <ErrorBoundary>
      <PageTransitionWrapper>
        <Routes>
          {/* مسارات عامة */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* مسارات خاصة بالمطورين */}
          <Route path="/debug" element={<DebugAuth />} />

          {/* مسارات محمية تحتاج إلى مصادقة */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route
            path="/members"
            element={
              <PrivateRoute>
                <MembersTable />
              </PrivateRoute>
            }
          />

          <Route
            path="/entry"
            element={
              <PrivateRoute>
                <DataEntryForm />
              </PrivateRoute>
            }
          />

          <Route
            path="/entry/:id"
            element={
              <PrivateRoute>
                <DataEntryForm />
              </PrivateRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <PrivateRoute>
                <Analytics />
              </PrivateRoute>
            }
          />

          <Route
            path="/backup"
            element={
              <PrivateRoute>
                <BackupPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </PageTransitionWrapper>
    </ErrorBoundary>
  );
}

export default App;
