import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

interface RankedUser {
  userId: string;
  userName?: string;
  totalDuration: number;
  totalPlays: number;
  rank: number;
}

interface RankingStoryProps {
  rank: number;
  totalUsers: number;
  percentile: number;
  rankedUsers: RankedUser[];
  currentUserId: string;
}

export function RankingStory({
  rank,
  totalUsers,
  percentile,
  rankedUsers,
  currentUserId,
}: RankingStoryProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, rank, {
      duration: 1.5,
      ease: "easeOut",
    });

    return controls.stop;
  }, [count, rank]);

  const getMessage = () => {
    if (rank === 1) return "You're the ultimate binge champion!";
    if (rank <= 3) return "You're on the podium!";
    if (percentile >= 90) return "You're in the top 10%!";
    if (percentile >= 75) return "You're in the top quarter!";
    if (percentile >= 50) return "You're above average!";
    return "Every minute counts!";
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.round(minutes / 60);
    if (hours < 1) return `${minutes}m`;
    return `${hours}h`;
  };

  // Get podium users (top 3)
  const podiumUsers = rankedUsers.slice(0, 3);
  const restUsers = rankedUsers.slice(3, 10);

  // Reorder for podium display: [2nd, 1st, 3rd]
  const podiumOrder = [
    podiumUsers[1], // 2nd place on left
    podiumUsers[0], // 1st place in center
    podiumUsers[2], // 3rd place on right
  ].filter(Boolean);

  const podiumHeights = ["h-32", "h-40", "h-24"]; // Heights for 2nd, 1st, 3rd
  const podiumColors = [
    "from-gray-400 to-gray-500", // Silver
    "from-yellow-400 to-yellow-600", // Gold
    "from-orange-400 to-orange-600", // Bronze
  ];

  const medals = ["🥈", "🥇", "🥉"];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 md:p-8 overflow-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl"
      >
        {/* Title */}
        <motion.p
          className="text-2xl md:text-3xl text-text-secondary mb-4 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          2025 Leaderboard
        </motion.p>

        {/* Your rank badge */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="inline-block bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/50 rounded-full px-6 py-3">
            <span className="text-text-secondary">You ranked </span>
            <span className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-400 to-pink-500 bg-clip-text text-transparent">
              <motion.span>{rounded}</motion.span>
            </span>
            <span className="text-text-secondary"> out of {totalUsers}</span>
          </div>
          <p className="text-text-tertiary mt-2">{getMessage()}</p>
        </motion.div>

        {/* Podium */}
        <div className="flex items-end justify-center gap-4 mb-8">
          {podiumOrder.map((user, index) => {
            if (!user) return null;
            const isCurrentUser = user.userId === currentUserId;
            const actualRank = user.rank;

            return (
              <motion.div
                key={user.userId}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.6 + index * 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
                style={{ width: "160px" }}
              >
                {/* User info above podium */}
                <motion.div
                  className="mb-3 text-center"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.2 }}
                >
                  {/* Medal */}
                  <motion.div
                    className="text-6xl mb-2"
                    animate={{
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      delay: 1.2 + index * 0.2,
                      duration: 0.5,
                    }}
                  >
                    {medals[index]}
                  </motion.div>

                  {/* User name */}
                  <div
                    className={`font-bold text-sm mb-1 truncate px-2 ${
                      isCurrentUser ? "text-primary" : "text-white"
                    }`}
                  >
                    {user.userName || `User ${user.userId.slice(0, 8)}`}
                    {isCurrentUser && <div className="text-xs text-primary">YOU</div>}
                  </div>

                  {/* Stats */}
                  <div className="text-xl font-bold text-primary">
                    {formatDuration(user.totalDuration)}
                  </div>
                  <div className="text-xs text-text-tertiary">{user.totalPlays} plays</div>
                </motion.div>

                {/* Podium block */}
                <motion.div
                  className={`w-full ${podiumHeights[index]} bg-gradient-to-b ${podiumColors[index]} rounded-t-lg relative shadow-lg flex items-center justify-center`}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{
                    delay: 1 + index * 0.2,
                    type: "spring",
                    stiffness: 200,
                  }}
                  style={{ transformOrigin: "bottom" }}
                >
                  {/* Rank number on podium */}
                  <div className="text-5xl font-bold text-white/90 drop-shadow-lg">
                    {actualRank}
                  </div>

                  {/* Glow effect */}
                  {isCurrentUser && (
                    <motion.div
                      className="absolute inset-0 bg-primary/30 rounded-t-lg"
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Rest of the leaderboard */}
        {restUsers.length > 0 && (
          <motion.div
            className="bg-secondary-bg/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
          >
            <div className="p-2 text-center text-xs text-text-tertiary border-b border-white/10">
              Top 4-10
            </div>
            <div className="max-h-64 overflow-y-auto">
              {restUsers.map((user, index) => {
                const isCurrentUser = user.userId === currentUserId;
                return (
                  <motion.div
                    key={user.userId}
                    className={`flex items-center justify-between p-3 border-b border-white/5 ${
                      isCurrentUser
                        ? "bg-primary/20 border-primary/30"
                        : "hover:bg-secondary-bg/80"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2 + index * 0.05 }}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-text-secondary font-bold w-8 text-center flex-shrink-0">
                        {user.rank}
                      </span>
                      <span
                        className={`font-semibold truncate ${
                          isCurrentUser ? "text-white" : "text-text-primary"
                        }`}
                      >
                        {user.userName || `User ${user.userId.slice(0, 8)}`}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs bg-primary px-2 py-0.5 rounded-full">
                            YOU
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span className="text-text-tertiary text-sm">
                        {user.totalPlays}
                      </span>
                      <span className="font-bold text-primary min-w-[3rem] text-right">
                        {formatDuration(user.totalDuration)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Show current user if outside top 10 */}
        {rank > 10 && (
          <motion.div
            className="mt-4 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2 }}
          >
            <div className="text-center text-text-tertiary text-sm mb-2">...</div>
            {(() => {
              const currentUserData = rankedUsers.find((u) => u.userId === currentUserId);
              if (!currentUserData) return null;
              return (
                <div className="bg-primary/20 border-2 border-primary/50 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold w-8 text-center">
                      {currentUserData.rank}
                    </span>
                    <span className="font-semibold text-white">
                      {currentUserData.userName ||
                        `User ${currentUserData.userId.slice(0, 8)}`}
                      <span className="ml-2 text-xs bg-primary px-2 py-1 rounded-full">
                        YOU
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-text-tertiary text-sm">
                      {currentUserData.totalPlays}
                    </span>
                    <span className="font-bold text-primary">
                      {formatDuration(currentUserData.totalDuration)}
                    </span>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
