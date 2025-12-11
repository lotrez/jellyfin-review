import { motion } from "framer-motion";
import { ShareableCard } from "../ShareableCard";
import html2canvas from "html2canvas";
import { useState } from "react";

interface FinaleStoryProps {
  userName: string;
  totalHours: number;
  totalPlays: number;
  topShow: {
    name: string;
    episodes: number;
  };
  rank: number;
  totalUsers: number;
  onRestart?: () => void;
}

export function FinaleStory({
  userName,
  totalHours,
  totalPlays,
  topShow,
  rank,
  totalUsers,
  onRestart,
}: FinaleStoryProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleShare = async () => {
    setIsGenerating(true);
    try {
      const card = document.getElementById("shareable-card");
      if (!card) return;

      const canvas = await html2canvas(card, {
        backgroundColor: null,
        scale: 2,
      });

      // Convert to blob
      canvas.toBlob((blob) => {
        if (!blob) return;

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `${userName}-jellyfin-wrapped-2025.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error("Failed to generate image:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      {/* Confetti-like particles */}
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            background: [
              "#aa5cc3",
              "#9b4dca",
              "#c084fc",
              "#e879f9",
              "#f472b6",
            ][i % 5],
            left: `${Math.random() * 100}%`,
          }}
          initial={{ y: -20, opacity: 0, rotate: 0 }}
          animate={{
            y: window.innerHeight + 20,
            opacity: [0, 1, 1, 0],
            rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
            ease: "linear",
            repeat: Infinity,
          }}
        />
      ))}

      <motion.div
        className="relative z-10 max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-8xl mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.3,
            type: "spring",
            stiffness: 200,
            damping: 10,
          }}
        >
          🎉
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          That's a wrap!
        </motion.h1>

        <motion.p
          className="text-2xl md:text-3xl text-text-secondary mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          {userName}, you made 2025 unforgettable with {totalHours} hours of amazing content
        </motion.p>

        <motion.div
          className="bg-gradient-to-br from-secondary-bg to-input-bg p-8 rounded-2xl border border-white/10 mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
        >
          <p className="text-xl text-text-primary mb-4">
            Here's to another year of incredible stories, epic binges, and countless hours of entertainment!
          </p>
          <motion.div
            className="text-6xl"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🍿
          </motion.div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <motion.button
            onClick={onRestart}
            className="px-8 py-4 bg-primary hover:bg-primary-hover active:bg-primary-active rounded-xl font-semibold text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Watch Again
          </motion.button>

          <motion.button
            onClick={handleShare}
            disabled={isGenerating}
            className="px-8 py-4 bg-secondary-bg hover:bg-input-bg border border-white/10 rounded-xl font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: isGenerating ? 1 : 1.05 }}
            whileTap={{ scale: isGenerating ? 1 : 0.95 }}
          >
            {isGenerating ? "Generating..." : "Download Wrapped Image"}
          </motion.button>
        </motion.div>

      </motion.div>

      {/* Hidden card for image generation */}
      <div className="fixed -left-[9999px] top-0">
        <ShareableCard
          userName={userName}
          totalHours={totalHours}
          totalPlays={totalPlays}
          topShow={topShow}
          rank={rank}
          totalUsers={totalUsers}
        />
      </div>
    </div>
  );
}
