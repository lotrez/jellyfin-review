import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

interface TotalPlaysStoryProps {
  totalPlays: number;
}

export function TotalPlaysStory({ totalPlays }: TotalPlaysStoryProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, totalPlays, {
      duration: 2,
      ease: "easeOut",
    });

    return controls.stop;
  }, [count, totalPlays]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      {/* Split background effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-tl from-purple-500/20 to-transparent"
        initial={{ x: "100%" }}
        animate={{ x: "0%" }}
        transition={{ duration: 1, ease: "easeOut" }}
      />

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.p
          className="text-2xl md:text-3xl text-text-secondary mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          You hit play
        </motion.p>

        <motion.div
          className="relative mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
          <motion.h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-primary via-purple-400 to-pink-500 bg-clip-text text-transparent leading-none">
            <motion.span>{rounded}</motion.span>
          </motion.h1>

          {/* Multiple glow layers for intense effect */}
          <motion.div
            className="absolute inset-0 blur-3xl bg-primary/30 -z-10"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute inset-0 blur-2xl bg-purple-500/20 -z-10"
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1.1, 1, 1.1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </motion.div>

        <motion.p
          className="text-4xl md:text-5xl font-semibold text-white mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          times this year
        </motion.p>

        {/* Fun facts based on play count */}
        <motion.div
          className="max-w-md mx-auto space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="bg-secondary-bg/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <p className="text-text-secondary">
              {totalPlays > 1000
                ? "Over a thousand moments of entertainment! 🎬"
                : totalPlays > 500
                  ? "You've built quite the viewing history! 📺"
                  : totalPlays > 100
                    ? "That's a lot of watching! 🍿"
                    : "Quality selections all year! ⭐"}
            </p>
          </div>

          {totalPlays > 365 && (
            <motion.div
              className="bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 rounded-xl p-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 }}
            >
              <p className="text-white font-semibold">
                More than one play per day! 🔥
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
