import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Button from "./ui/Button";
import Card from "./ui/Card";

/**
 * واجهة تعريف خصائص مكون حاجز الأخطاء
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showHomeButton?: boolean;
  showReloadButton?: boolean;
}

/**
 * واجهة تعريف حالة مكون حاجز الأخطاء
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * مكون حاجز الأخطاء - يلتقط الأخطاء في شجرة المكونات ويعرض واجهة احتياطية
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * تحديث الحالة عند حدوث خطأ
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  /**
   * التقاط معلومات الخطأ والمكون المسبب
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // استدعاء دالة معالجة الخطأ المخصصة إن وجدت
    this.props.onError?.(error, errorInfo);

    // تسجيل الخطأ في وحدة التحكم للتصحيح
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  /**
   * إعادة تحميل الصفحة
   */
  handleReload = () => {
    window.location.reload();
  };

  /**
   * الانتقال إلى الصفحة الرئيسية
   */
  handleGoHome = () => {
    window.location.href = "/";
  };

  /**
   * إعادة تعيين حالة الخطأ
   */
  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  /**
   * رسالة الخطأ باللغة العربية
   */
  getErrorMessage = (): string => {
    const { error } = this.state;

    if (error?.name === "ChunkLoadError") {
      return "فشل في تحميل موارد التطبيق. يرجى إعادة تحميل الصفحة.";
    }

    if (error?.message?.includes("Network Error")) {
      return "مشكلة في الاتصال بالشبكة. يرجى التحقق من الاتصال والمحاولة مرة أخرى.";
    }

    return "حدث خطأ غير متوقع في التطبيق. يرجى المحاولة مرة أخرى أو الاتصال بالدعم الفني.";
  };

  /**
   * رسالة الخطأ باللغة الإنجليزية
   */
  getErrorMessageEn = (): string => {
    const { error } = this.state;

    if (error?.name === "ChunkLoadError") {
      return "Failed to load application resources. Please reload the page.";
    }

    if (error?.message?.includes("Network Error")) {
      return "Network connection problem. Please check your connection and try again.";
    }

    return "An unexpected error occurred in the application. Please try again or contact technical support.";
  };

  /**
   * عرض واجهة الخطأ أو المحتوى العادي
   */
  render() {
    const { hasError, error, errorInfo } = this.state;
    const {
      children,
      fallback,
      showHomeButton = true,
      showReloadButton = true,
    } = this.props;

    // إذا لم يحدث خطأ، عرض المحتوى العادي
    if (!hasError) {
      return children;
    }

    // إذا كان هناك مكون احتياطي محدد، استخدامه
    if (fallback) {
      return fallback;
    }

    // عرض واجهة الخطأ الافتراضية
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-background-primary flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <div className="mb-6">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary mb-2">
              عذراً، حدث خطأ
            </h1>
            <p className="text-gray-600 dark:text-dark-text-muted">
              {this.getErrorMessage()}
            </p>
          </div>

          <div className="space-y-3">
            {showReloadButton && (
              <Button
                onClick={this.handleReload}
                className="w-full"
                variant="primary"
              >
                <RefreshCw className="h-4 w-4 ml-2" />
                إعادة تحميل الصفحة
              </Button>
            )}

            {showHomeButton && (
              <Button
                onClick={this.handleGoHome}
                className="w-full"
                variant="outline"
              >
                <Home className="h-4 w-4 ml-2" />
                العودة للصفحة الرئيسية
              </Button>
            )}
          </div>

          {/* معلومات الخطأ للمطورين في وضع التطوير */}
          {import.meta.env.DEV && error && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 dark:text-dark-text-muted mb-2">
                تفاصيل الخطأ (للمطورين)
              </summary>
              <div className="bg-gray-100 dark:bg-dark-background-secondary p-3 rounded-md text-xs font-mono overflow-auto max-h-32">
                <div className="text-red-600 dark:text-red-400 font-semibold mb-1">
                  {error.name}: {error.message}
                </div>
                <div className="text-gray-600 dark:text-gray-400 mb-2">
                  {error.stack}
                </div>
                {errorInfo && (
                  <div className="text-red-600 dark:text-red-400">
                    Component Stack:
                    {errorInfo.componentStack}
                  </div>
                )}
              </div>
            </details>
          )}
        </Card>
      </div>
    );
  }
}

export default ErrorBoundary;
