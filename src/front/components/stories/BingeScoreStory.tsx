import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

interface BingeScoreStoryProps {
  averageSessionMinutes: number;
  totalPlays: number;
}

export function BingeScoreStory({
  averageSessionMinutes,
  totalPlays,
}: BingeScoreStoryProps) {
  // Calculate binge score (0-100) based on average session length and frequency
  // Longer sessions and more plays = higher score
  const sessionScore = Math.min((averageSessionMinutes / 120) * 50, 50); // Max 50 for 2+ hour sessions
  const frequencyScore = Math.min((totalPlays / 500) * 50, 50); // Max 50 for 500+ plays
  const bingeScore = Math.round(sessionScore + frequencyScore);

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, bingeScore, {
      duration: 2,
      ease: "easeOut",
    });

    return controls.stop;
  }, [count, bingeScore]);

  const getLevel = () => {
    if (bingeScore >= 90) return { name: "LEGENDARY", color: "from-yellow-400 to-orange-500" };
    if (bingeScore >= 75) return { name: "MASTER", color: "from-purple-400 to-pink-500" };
    if (bingeScore >= 60) return { name: "EXPERT", color: "from-blue-400 to-purple-500" };
    if (bingeScore >= 40) return { name: "ENTHUSIAST", color: "from-green-400 to-blue-500" };
    return { name: "CASUAL", color: "from-gray-400 to-gray-500" };
  };

  const level = getLevel();

  // Gauge rotation (0 = -90deg, 100 = 90deg)
  const rotation = useTransform(count, [0, 100], [-90, 90]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.p
          className="text-2xl md:text-3xl text-text-secondary mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Your Binge Score
        </motion.p>

        {/* Gauge container */}
        <motion.div
          className="relative w-80 h-80 mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
          {/* Gauge background arc */}
          <svg className="w-full h-full" viewBox="0 0 200 200">
            {/* Background arc */}
            <path
              d="M 30 170 A 85 85 0 0 1 170 170"
              fill="none"
              stroke="currentColor"
              strokeWidth="20"
              className="text-secondary-bg"
              strokeLinecap="round"
            />

            {/* Colored arc (animated) */}
            <motion.path
              d="M 30 170 A 85 85 0 0 1 170 170"
              fill="none"
              strokeWidth="20"
              strokeLinecap="round"
              className={`bg-gradient-to-r ${level.color}`}
              stroke="url(#gradient)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: bingeScore / 100 }}
              transition={{ delay: 0.8, duration: 2, ease: "easeOut" }}
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className="text-primary" stopColor="currentColor" />
                <stop offset="50%" className="text-purple-400" stopColor="currentColor" />
                <stop offset="100%" className="text-pink-500" stopColor="currentColor" />
              </linearGradient>
            </defs>

            {/* Needle */}
            <motion.g
              style={{ rotate: rotation, originX: "100px", originY: "170px" }}
            >
              <line
                x1="100"
                y1="170"
                x2="100"
                y2="100"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="100" cy="170" r="8" fill="white" />
            </motion.g>
          </svg>

          {/* Score in center */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ top: "40%" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <motion.div className="text-7xl font-bold text-white">
              {rounded}
            </motion.div>
            <div className="text-text-secondary">/ 100</div>
          </motion.div>
        </motion.div>

        {/* Level badge */}
        <motion.div
          className={`inline-block px-8 py-3 rounded-full bg-gradient-to-r ${level.color} mb-4`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5, type: "spring", stiffness: 200 }}
        >
          <span className="text-2xl font-bold text-white">{level.name}</span>
        </motion.div>

        {/* Stats breakdown */}
        <motion.div
          className="flex gap-8 justify-center text-text-secondary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8 }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {Math.round(averageSessionMinutes)} min
            </div>
            <div className="text-sm">avg session</div>
          </div>

          <div className="w-px h-12 bg-white/20" />

          <div className="text-center">
            <div className="text-2xl font-bold text-white">{totalPlays}</div>
            <div className="text-sm">total plays</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
