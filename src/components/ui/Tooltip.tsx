import React, { useState, cloneElement } from "react";
import type {
  ReactElement,
  ReactNode,
  JSXElementConstructor,
  MouseEvent,
  FocusEvent,
} from "react";

interface TooltipProps {
  content: ReactNode;
  children: ReactElement<
    {
      onMouseEnter?: (e: MouseEvent) => void;
      onMouseLeave?: (e: MouseEvent) => void;
      onFocus?: (e: FocusEvent) => void;
      onBlur?: (e: FocusEvent) => void;
      className?: string;
      style?: React.CSSProperties;
    },
    string | JSXElementConstructor<unknown>
  >;
  position?: "top" | "right" | "bottom" | "left";
  delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  delay = 200,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const showTooltip = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  // Clean up timeouts on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  // Position classes
  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2",
    right: "left-full top-1/2 transform -translate-y-1/2 translate-x-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 translate-y-2",
    left: "right-full top-1/2 transform -translate-y-1/2 -translate-x-2",
  };

  // Arrow classes
  const arrowClasses = {
    top: "bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45",
    right:
      "left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45",
    bottom:
      "top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45",
    left: "right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 rotate-45",
  };

  // Safely clone the child element with our event handlers
  const childWithProps = cloneElement(children, {
    onMouseEnter: (e: MouseEvent) => {
      children.props.onMouseEnter?.(e);
      showTooltip();
    },
    onMouseLeave: (e: MouseEvent) => {
      children.props.onMouseLeave?.(e);
      hideTooltip();
    },
    onFocus: (e: FocusEvent) => {
      children.props.onFocus?.(e);
      showTooltip();
    },
    onBlur: (e: FocusEvent) => {
      children.props.onBlur?.(e);
      hideTooltip();
    },
  });

  return (
    <div className="relative inline-block">
      {childWithProps}

      {isVisible && (
        <div
          className={`absolute z-50 min-w-[120px] max-w-xs p-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 ${positionClasses[position]}`}
          role="tooltip"
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 ${arrowClasses[position]}`}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
