import { motion } from "framer-motion";

interface LoyaltyStoryProps {
  showName: string;
  percentage: number;
}

export function LoyaltyStory({ showName, percentage }: LoyaltyStoryProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      {/* Animated particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/30 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0,
          }}
          animate={{
            y: [null, Math.random() * window.innerHeight],
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.3,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
        >
          {/* Badge */}
          <div className="relative inline-block">
            <motion.div
              className="w-48 h-48 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(170, 92, 195, 0.5)",
                  "0 0 60px rgba(170, 92, 195, 0.8)",
                  "0 0 20px rgba(170, 92, 195, 0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-44 h-44 rounded-full bg-bg flex items-center justify-center">
                <span className="text-7xl">💜</span>
              </div>
            </motion.div>

            {/* Ribbon tails */}
            <motion.div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="w-8 h-16 bg-gradient-to-b from-primary to-purple-600 transform -rotate-12 rounded-b" />
              <div className="w-8 h-16 bg-gradient-to-b from-primary to-purple-600 transform rotate-12 rounded-b" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Loyalty Badge Earned
          </h2>
          <p className="text-xl text-text-secondary">
            You're a true superfan
          </p>
        </motion.div>

        <motion.div
          className="bg-secondary-bg/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-md mx-auto mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3 }}
        >
          <motion.div
            className="text-6xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent mb-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5, type: "spring", stiffness: 300 }}
          >
            {percentage}%
          </motion.div>
          <p className="text-text-secondary">
            of your watch time was dedicated to
          </p>
          <p className="text-2xl font-bold text-white mt-2">{showName}</p>
        </motion.div>

        <motion.p
          className="text-lg text-text-tertiary max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          When you find something you love, you commit! That's dedication worth celebrating.
        </motion.p>
      </motion.div>
    </div>
  );
}
