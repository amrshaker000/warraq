import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  once?: boolean;
  threshold?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
  direction = "up",
  distance = 30,
  once = true,
  threshold = 0.1,
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, {
    once,
    amount: threshold,
    margin: "-10% 0px -10% 0px",
  });

  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: distance };
      case "down":
        return { opacity: 0, y: -distance };
      case "left":
        return { opacity: 0, x: distance };
      case "right":
        return { opacity: 0, x: -distance };
      default:
        return { opacity: 0, y: distance };
    }
  };

  const getAnimatePosition = () => {
    return { opacity: 1, x: 0, y: 0 };
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitialPosition()}
      animate={isInView ? getAnimatePosition() : getInitialPosition()}
      transition={{
        duration,
        delay,
        ease: "easeOut" as const,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
