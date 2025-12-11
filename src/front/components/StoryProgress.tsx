import { motion } from "framer-motion";

interface StoryProgressProps {
  total: number;
  current: number;
  onSelect?: (index: number) => void;
}

export function StoryProgress({ total, current, onSelect }: StoryProgressProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex gap-2 p-4">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect?.(index)}
          className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer hover:bg-white/30 transition-colors"
          aria-label={`Go to story ${index + 1}`}
        >
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: "0%" }}
            animate={{
              width: index < current ? "100%" : index === current ? "100%" : "0%",
            }}
            transition={{ duration: 0.3 }}
          />
        </button>
      ))}
    </div>
  );
}
