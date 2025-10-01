import React from "react";
import { motion } from "framer-motion";

interface AnimatedTableProps {
  children: React.ReactNode;
  className?: string;
}

const AnimatedTable: React.FC<AnimatedTableProps> = ({
  children,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedTable;
