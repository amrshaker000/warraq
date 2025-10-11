import React, { useState, useEffect, useCallback } from "react";
import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  allowedEmailDomains?: string[];
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  allowedEmailDomains,
  className,
  id,
  type,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  // دالة للتحقق من صحة البريد الإلكتروني
  const validateEmail = useCallback((email: string): boolean => {
    if (!email) return true; // فارغ مسموح إذا لم يكن مطلوباً

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;

    if (allowedEmailDomains && allowedEmailDomains.length > 0) {
      const domain = email.split('@')[1];
      return allowedEmailDomains.some((allowedDomain) => domain === allowedDomain);
    }

    return true;
  }, [allowedEmailDomains]);

  // حالة التحقق من صحة البريد الإلكتروني
  const [emailError, setEmailError] = useState<string | null>(null);

  // التحقق من صحة البريد الإلكتروني عند التغيير
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isValid = validateEmail(value);

    if (type === 'email' && value && !isValid) {
      setEmailError('يرجى إدخال بريد إلكتروني صحيح من النطاقات المسموحة');
    } else {
      setEmailError(null);
    }

    // استدعاء onChange الأصلي إذا كان موجوداً
    if (props.onChange) {
      props.onChange(e);
    }
  };

  // تحديث الخطأ عند التحقق الأولي
  useEffect(() => {
    if (type === 'email' && props.value) {
      const isValid = validateEmail(props.value as string);
      if (!isValid) {
        setEmailError('يرجى إدخال بريد إلكتروني صحيح من النطاقات المسموحة');
      }
    }
  }, [props.value, allowedEmailDomains, type, validateEmail]);

  const displayError = error || emailError;

  return (
    <div className={clsx("space-y-2", fullWidth && "w-full")}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-wide"
        >
          {label}
          {props.required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={clsx(
            "block w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-background-primary text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-400 dark:focus:border-red-400 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 shadow-sm hover:shadow-md focus:shadow-lg py-3",
            leftIcon && "pl-16",
            rightIcon && "pr-16",
            displayError &&
              "border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-400 dark:focus:ring-red-400 dark:focus:border-red-400",
            className,
          )}
          onChange={type === 'email' ? handleEmailChange : props.onChange}
          {...props}
        />

        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
            <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/30">
              <span className="text-red-600 dark:text-red-400 [&>button]:pointer-events-auto">
                {leftIcon}
              </span>
            </div>
          </div>
        )}

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors duration-200">
              <span className="text-red-600 dark:text-red-400 [&>button]:pointer-events-auto">
                {rightIcon}
              </span>
            </div>
          </div>
        )}
      </div>
      {displayError && (
        <p className="text-sm text-red-600 dark:text-red-400 font-medium">
          {displayError}
        </p>
      )}
      {helperText && !displayError && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
