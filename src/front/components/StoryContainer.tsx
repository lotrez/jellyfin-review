import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

interface StoryContainerProps {
  children: ReactNode;
  direction: number;
  currentStory: number;
}

export function StoryContainer({
  children,
  direction,
  currentStory,
}: StoryContainerProps) {
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-bg">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentStory}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
