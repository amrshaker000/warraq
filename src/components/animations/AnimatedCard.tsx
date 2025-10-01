import React from "react";
import { motion } from "framer-motion";
import Card from "../ui/Card";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      whileHover={{
        y: -2,
        transition: { duration: 0.2 },
      }}
    >
      <Card className={className}>{children}</Card>
    </motion.div>
  );
};

export default AnimatedCard;
