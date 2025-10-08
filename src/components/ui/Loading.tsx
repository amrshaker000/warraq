import React from "react";
import { Loader2 } from "lucide-react";
import { clsx } from "clsx";
import type { LoadingProps } from "../../types";

/**
 * مكون مؤشر التحميل - يعرض مؤشر تحميل متحرك مع رسالة اختيارية
 *
 * @example
 * ```tsx
 * <Loading size="large" text="جار التحميل..." />
 * ```
 */
const Loading: React.FC<LoadingProps> = ({
  size = "medium",
  text,
  className,
  "data-testid": testId,
}) => {
  // تعريف أحجام المؤشر المختلفة
  const sizeClasses: Record<NonNullable<LoadingProps["size"]>, string> = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  };

  const containerClasses = clsx(
    "flex flex-col items-center justify-center gap-3",
    className,
  );

  return (
    <div
      className={containerClasses}
      data-testid={testId || "loading-spinner"}
      role="status"
      aria-live="polite"
    >
      <Loader2
        className={clsx(
          "animate-spin text-red-600 dark:text-red-400",
          sizeClasses[size],
        )}
        aria-hidden="true"
      />
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
          {text}
        </p>
      )}
      {/* شاشة للقراء الشاشة */}
      <span className="sr-only">{text || "جار التحميل..."}</span>
    </div>
  );
};

export default Loading;
