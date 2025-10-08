import React from "react";
import type { ReactNode } from "react";
import { Tooltip, Card } from "../ui";
import { HelpCircle } from "lucide-react";

interface ChartContainerProps {
  title: string;
  children: ReactNode;
  className?: string;
  height?: string | number;
  description?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  children,
  className = "",
  height = "h-48 lg:h-64",
  description,
  isLoading = false,
  isEmpty = false,
  emptyMessage = "No data available",
}) => {
  return (
    <Card className={`p-3 sm:p-4 lg:p-6 ${className}`}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-dark-text-primary">
          {title}
        </h3>
        {description && (
          <Tooltip content={description}>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 dark:text-dark-text-muted dark:hover:text-dark-text-secondary"
            >
              <HelpCircle className="h-4 w-4" />
              <span className="sr-only">Info</span>
            </button>
          </Tooltip>
        )}
      </div>
      <div
        className={`w-full ${height} flex items-center justify-center ${
          isLoading ? "animate-pulse" : ""
        }`}
      >
        {isLoading ? (
          <div className="text-gray-500 dark:text-dark-text-secondary">Loading...</div>
        ) : isEmpty ? (
          <div className="text-gray-400 dark:text-dark-text-muted text-center p-4">
            <div className="text-sm">{emptyMessage}</div>
          </div>
        ) : (
          children
        )}
      </div>
    </Card>
  );
};

export default ChartContainer;
