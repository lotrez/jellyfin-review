import { motion } from "framer-motion";

interface Show {
  showName: string;
  playCount: number;
  totalDuration: number;
  seriesId: string;
  imageUrl: string;
}

interface MostWatchedStoryProps {
  shows: Show[];
}

export function MostWatchedStory({ shows }: MostWatchedStoryProps) {
  if (!shows || shows.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-text-secondary">No shows found</p>
      </div>
    );
  }

  const topShow = shows[0]!;
  const otherShows = shows.slice(1, 5);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background circles */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 w-full max-w-6xl">
        <motion.p
          className="text-2xl md:text-3xl text-text-secondary mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Your Top Shows of 2025
        </motion.p>

        {/* Top show - Featured */}
        <motion.div
          className="bg-gradient-to-br from-secondary-bg to-input-bg rounded-3xl shadow-2xl mb-8 border border-white/10 overflow-hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.4,
            duration: 0.6,
            type: "spring",
            stiffness: 200,
          }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6 p-6">
            <motion.div
              className="relative flex-shrink-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="absolute -top-2 -left-2 bg-gradient-to-r from-primary to-pink-500 text-white font-bold px-4 py-1 rounded-full text-sm z-10">
                #1
              </div>
              <img
                src={topShow.imageUrl}
                alt={topShow.showName}
                className="w-32 h-48 md:w-40 md:h-60 object-cover rounded-xl shadow-lg"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </motion.div>

            <motion.div
              className="flex-1 text-center md:text-left"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {topShow.showName}
              </h2>
              <div className="flex items-center justify-center md:justify-start gap-6 text-text-secondary">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {topShow.playCount}
                  </div>
                  <div className="text-sm">episodes</div>
                </div>
                <div className="w-px h-12 bg-white/20" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {Math.round(topShow.totalDuration / 60)}
                  </div>
                  <div className="text-sm">hours</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Other top shows - Grid */}
        {otherShows.length > 0 && (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            {otherShows.map((show, index) => (
              <motion.div
                key={show.seriesId}
                className="bg-secondary-bg/50 backdrop-blur-sm border border-white/10 rounded-xl p-3 hover:bg-secondary-bg transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative mb-2">
                  <div className="absolute -top-1 -left-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold w-6 h-6 rounded-full text-xs flex items-center justify-center z-10">
                    #{index + 2}
                  </div>
                  <img
                    src={show.imageUrl}
                    alt={show.showName}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <h3 className="text-white font-semibold text-sm mb-1 truncate">
                  {show.showName}
                </h3>
                <div className="flex items-center justify-between text-xs text-text-tertiary">
                  <span>{show.playCount} eps</span>
                  <span>{Math.round(show.totalDuration / 60)}h</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
