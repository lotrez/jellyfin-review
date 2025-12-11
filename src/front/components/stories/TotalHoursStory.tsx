import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

interface TotalHoursStoryProps {
  totalMinutes: number;
}

export function TotalHoursStory({ totalMinutes }: TotalHoursStoryProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const hours = Math.round(totalMinutes / 60);
  const days = Math.round(hours / 24);

  useEffect(() => {
    const controls = animate(count, hours, {
      duration: 2,
      ease: "easeOut",
    });

    return controls.stop;
  }, [count, hours]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <motion.p
          className="text-2xl md:text-3xl text-text-secondary mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          In 2025, you watched
        </motion.p>

        <motion.div className="relative mb-4">
          <motion.h1
            className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary via-purple-400 to-pink-500 bg-clip-text text-transparent"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          >
            <motion.span>{rounded}</motion.span>
          </motion.h1>

          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 blur-3xl bg-primary/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
          />
        </motion.div>

        <motion.p
          className="text-4xl md:text-5xl font-semibold text-white mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          hours of content
        </motion.p>

        <motion.div
          className="flex items-center justify-center gap-2 text-text-secondary text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span>That's</span>
          <span className="text-primary font-bold text-2xl">{days}</span>
          <span>days</span>
        </motion.div>

        <motion.p
          className="mt-8 text-text-tertiary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {hours > 100
            ? "Wow, you're a true binge-watcher!"
            : hours > 50
              ? "That's some serious watch time!"
              : "Quality over quantity!"}
        </motion.p>
      </motion.div>
    </div>
  );
}
