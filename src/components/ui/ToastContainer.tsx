import React from "react";
import Toast from "./Toast";
import type { ToastProps } from "./Toast";
import { useTheme } from "../../hooks/useTheme";

interface ToastContainerProps {
  toasts: ToastProps[];
  onRemoveToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemoveToast,
}) => {
  const { isRTL } = useTheme();

  return (
    <div
      className={`
        fixed z-50 pointer-events-none
        inset-x-0 bottom-6 px-4
        sm:inset-x-auto sm:px-0
        ${isRTL ? "sm:right-6" : "sm:left-6"}
        sm:top-6 sm:bottom-auto
        flex flex-col items-center gap-3
        max-h-[calc(100vh-2rem)]
        overflow-hidden
      `}
      aria-live="polite"
      aria-atomic="false"
      role="region"
      aria-label="الإشعارات"
    >
      <div className="flex flex-col items-center gap-3 w-full sm:w-auto sm:max-w-sm md:max-w-md lg:max-w-lg">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className="pointer-events-auto w-full animate-in slide-in-from-right-2 sm:slide-in-from-right-4 duration-300 ease-out"
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: "both",
            }}
          >
            <Toast {...toast} onClose={onRemoveToast} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;
