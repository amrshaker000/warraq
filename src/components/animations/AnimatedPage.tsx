import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";

interface AnimatedPageProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
}

const AnimatedPage: React.FC<AnimatedPageProps> = ({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
  direction = "up",
  distance = 20,
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.1,
    margin: "-5% 0px -5% 0px",
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

  return (
    <motion.div
      ref={ref}
      initial={getInitialPosition()}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : getInitialPosition()}
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

export default AnimatedPage;
