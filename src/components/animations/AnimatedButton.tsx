import React from "react";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import type { ButtonProps } from "../ui/Button";

interface AnimatedButtonProps extends ButtonProps {
  delay?: number;
  duration?: number;
  children?: React.ReactNode;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  delay = 0,
  duration = 0.3,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
      whileTap={{
        scale: 0.95,
        transition: { duration: 0.1 },
      }}
    >
      <Button {...props}>{children}</Button>
    </motion.div>
  );
};

export default AnimatedButton;
