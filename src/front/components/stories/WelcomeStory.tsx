import { motion } from "framer-motion";

interface WelcomeStoryProps {
  userName: string;
}

export function WelcomeStory({ userName }: WelcomeStoryProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h1
          className="text-6xl md:text-8xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {userName}
        </motion.h1>

        <motion.div
          className="text-3xl md:text-5xl font-semibold bg-gradient-to-r from-primary via-purple-400 to-pink-500 bg-clip-text text-transparent mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Your 2025 Wrapped
        </motion.div>

        <motion.p
          className="text-xl md:text-2xl text-text-secondary max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Let's take a look at your year in streaming
        </motion.p>

        <motion.div
          className="mt-12 text-text-tertiary text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          Press → or tap to continue
        </motion.div>
      </motion.div>
    </div>
  );
}
