import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

interface PageTransitionWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02,
  },
};

const pageTransition = {
  duration: 0.4,
  ease: "easeInOut" as const,
};

const PageTransitionWrapper: React.FC<PageTransitionWrapperProps> = ({
  children,
  className = "",
}) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className={`w-full ${className}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransitionWrapper;
