import React, { useEffect, useState } from "react";
import { clsx } from "clsx";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
  Loader2,
} from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { isRTL } = useTheme();
  const isIndefinite = !duration || duration <= 0;

  useEffect(() => {
    const visTimer = window.setTimeout(() => setIsVisible(true), 100);

    if (!isIndefinite) {
      const id = window.setTimeout(() => {
        handleClose();
      }, duration);
      return () => {
        window.clearTimeout(visTimer);
        window.clearTimeout(id);
      };
    }

    return () => {
      window.clearTimeout(visTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 300);
  };

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success:
      "bg-green-50/95 border-green-200 text-green-900 dark:bg-green-950/95 dark:border-green-800 dark:text-green-100",
    error:
      "bg-red-50/95 border-red-200 text-red-900 dark:bg-red-950/95 dark:border-red-800 dark:text-red-100",
    warning:
      "bg-amber-50/95 border-amber-200 text-amber-900 dark:bg-amber-950/95 dark:border-amber-800 dark:text-amber-100",
    info: "bg-red-50/95 border-red-200 text-red-900 dark:bg-red-950/95 dark:border-red-800 dark:text-red-100",
  };

  const iconColors = {
    success: "text-green-600 dark:text-green-400",
    error: "text-red-600 dark:text-red-400",
    warning: "text-amber-600 dark:text-amber-400",
    info: "text-red-600 dark:text-red-400",
  };

  const Icon = icons[type];

  const circleBgColors = {
    success: "bg-green-100 dark:bg-green-900/50",
    error: "bg-red-100 dark:bg-red-900/50",
    warning: "bg-amber-100 dark:bg-amber-900/50",
    info: "bg-red-100 dark:bg-red-900/50",
  } as const;

  const isAssertive = type === "error" || type === "warning";

  return (
    <div
      role={isAssertive ? "alert" : "status"}
      aria-live={isAssertive ? "assertive" : "polite"}
      className={clsx(
        "inline-block max-w-[90vw] sm:max-w-sm md:max-w-md lg:max-w-lg border rounded-2xl shadow-2xl pointer-events-auto transform transition-all duration-300 ease-out backdrop-blur-sm",
        "motion-reduce:transition-none",
        "ring-1 ring-black/10 dark:ring-white/10 dark:shadow-black/60 hover:shadow-3xl hover:scale-[1.02]",
        colors[type],
        isRTL ? "border-r-4" : "border-l-4",
        isVisible
          ? "translate-x-0 opacity-100 scale-100"
          : isRTL
            ? "-translate-x-full opacity-0 scale-95"
            : "translate-x-full opacity-0 scale-95",
      )}
      dir={isRTL ? "rtl" : "ltr"}
      onClick={handleClose}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div
            className={clsx(
              "flex-shrink-0 p-2 rounded-full",
              circleBgColors[type],
            )}
          >
            {isIndefinite ? (
              <Loader2
                className={clsx("h-5 w-5 animate-spin", iconColors[type])}
              />
            ) : (
              <Icon className={clsx("h-5 w-5", iconColors[type])} />
            )}
          </div>
          <div className={clsx("min-w-0 flex-auto flex flex-col gap-1")}>
            <h4 className="text-sm font-semibold break-words leading-tight">
              {String(title)}
            </h4>
            {message && (
              <p className="text-sm leading-relaxed opacity-90 break-words whitespace-pre-wrap">
                {String(message)}
              </p>
            )}
          </div>
          <div className={clsx("flex-shrink-0 flex", isRTL ? "mr-3" : "ml-3")}>
            <button
              className="inline-flex p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400 rounded-lg transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              aria-label="إغلاق الإشعار"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
