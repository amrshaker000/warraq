import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";

interface AnimatedListProps {
  children: React.ReactNode[];
  className?: string;
  itemDelay?: number;
  staggerDelay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  duration?: number;
}

const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  className = "",
  itemDelay = 0,
  staggerDelay = 0.1,
  direction = "up",
  distance = 20,
  duration = 0.5,
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: itemDelay,
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants = {
    hidden: getInitialPosition(),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children.map((child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AnimatedList;
