import React from "react";
import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

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
          id={inputId}
          className={clsx(
            "block w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 shadow-sm hover:shadow-md focus:shadow-lg py-3",
            leftIcon && "pl-16",
            rightIcon && "pr-16",
            error &&
              "border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-400 dark:focus:ring-red-400 dark:focus:border-red-400",
            className,
          )}
          {...props}
        />

        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30">
              <span className="text-blue-600 dark:text-blue-400 [&>button]:pointer-events-auto">
                {leftIcon}
              </span>
            </div>
          </div>
        )}

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200">
              <span className="text-blue-600 dark:text-blue-400 [&>button]:pointer-events-auto">
                {rightIcon}
              </span>
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 font-medium">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
