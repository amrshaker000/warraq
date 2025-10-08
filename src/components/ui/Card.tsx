import React from "react";
import { clsx } from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md" | "lg";
  rounded?: "none" | "sm" | "md" | "lg" | "xl";
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = "md",
  shadow = "md",
  rounded = "lg",
  hover = false,
}) => {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
  };

  const roundedClasses = {
    none: "",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
  };

  return (
    <div
      className={clsx(
        "bg-white dark:bg-dark-background-primary border border-gray-200 dark:border-dark-border-primary",
        paddingClasses[padding],
        shadowClasses[shadow],
        roundedClasses[rounded],
        hover && "hover:shadow-lg transition-shadow duration-200",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Card;
