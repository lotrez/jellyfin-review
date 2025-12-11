import { useJellyfin } from "../context/jellyfin-context";
import { useStoryNavigation } from "../hooks/useStoryNavigation";
import { StoryContainer } from "../components/StoryContainer";
import { StoryProgress } from "../components/StoryProgress";
import { WelcomeStory } from "../components/stories/WelcomeStory";
import { TotalHoursStory } from "../components/stories/TotalHoursStory";
import { MostWatchedStory } from "../components/stories/MostWatchedStory";
import { RankingStory } from "../components/stories/RankingStory";
import { BingeScoreStory } from "../components/stories/BingeScoreStory";
import { LoyaltyStory } from "../components/stories/LoyaltyStory";
import { TotalPlaysStory } from "../components/stories/TotalPlaysStory";
import { FinaleStory } from "../components/stories/FinaleStory";
import { useState } from "react";

export default function Review() {
	const { user, stats, userId } = useJellyfin();
	const [touchStart, setTouchStart] = useState<number | null>(null);
	const [touchEnd, setTouchEnd] = useState<number | null>(null);

	// Calculate stats from the data
	const userStats = stats.usageRank?.find((u) => u.userId === userId);
	const totalMinutes = userStats?.totalDuration || 0;
	const totalPlays = userStats?.totalPlays || 0;
	const averageSessionMinutes = userStats?.averageDuration || 0;

	// Calculate ranking
	const sortedRanks = [...(stats.usageRank || [])].sort(
		(a, b) => b.totalDuration - a.totalDuration
	);
	const rank = sortedRanks.findIndex((u) => u.userId === userId) + 1;
	const totalUsers = sortedRanks.length;
	const percentile = ((totalUsers - rank + 1) / totalUsers) * 100;

	// Build leaderboard with user names
	const rankedUsers = sortedRanks.map((userRank, index) => {
		const publicUser = stats.publicUsers?.data.find((pu) => pu.Id === userRank.userId);
		return {
			userId: userRank.userId,
			userName: publicUser?.Name,
			totalDuration: userRank.totalDuration,
			totalPlays: userRank.totalPlays,
			rank: index + 1,
		};
	});

	// Calculate loyalty percentage
	const topShow = stats.topShows?.[0];
	const loyaltyPercentage = topShow?.totalDuration
		? Math.round((topShow.totalDuration / totalMinutes) * 100)
		: 0;
	const isLoyal = loyaltyPercentage >= 30; // Show loyalty badge if 30%+ of time on one show

	// Determine total stories (loyalty story is conditional)
	const totalStories = isLoyal ? 8 : 7;

	const { currentStory, direction, nextStory, prevStory, goToStory } = useStoryNavigation({
		totalStories,
		onComplete: () => {
			// Could navigate somewhere or restart
			console.log("Review completed!");
		},
	});

	// Swipe detection
	const minSwipeDistance = 50;

	const onTouchStart = (e: React.TouchEvent) => {
		setTouchEnd(null);
		setTouchStart(e.targetTouches[0]!.clientX);
	};

	const onTouchMove = (e: React.TouchEvent) => {
		setTouchEnd(e.targetTouches[0]!.clientX);
	};

	const onTouchEnd = () => {
		if (!touchStart || !touchEnd) return;

		const distance = touchStart - touchEnd;
		const isLeftSwipe = distance > minSwipeDistance;
		const isRightSwipe = distance < -minSwipeDistance;

		if (isLeftSwipe) {
			nextStory();
		} else if (isRightSwipe) {
			prevStory();
		}
	};

	// Loading state
	if (stats.isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-bg">
				<div className="text-center">
					<div className="text-4xl font-bold text-white mb-4">
						Preparing your 2025 Wrapped...
					</div>
					<div className="text-text-secondary">This won't take long!</div>
				</div>
			</div>
		);
	}

	// Error state
	if (!user || !userStats || !stats.topShows || stats.topShows.length === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-bg">
				<div className="text-center">
					<div className="text-4xl font-bold text-white mb-4">
						Oops! Something went wrong
					</div>
					<div className="text-text-secondary">
						We couldn't load your stats. Please try again.
					</div>
				</div>
			</div>
		);
	}

	// Story selection with conditional loyalty story
	let storyIndex = currentStory;
	if (!isLoyal && currentStory >= 5) {
		storyIndex = currentStory + 1; // Skip loyalty story slot
	}

	const renderStory = () => {
		switch (storyIndex) {
			case 0:
				return <WelcomeStory userName={user.Name} />;
			case 1:
				return <TotalHoursStory totalMinutes={totalMinutes} />;
			case 2:
				return <MostWatchedStory shows={stats.topShows!} />;
			case 3:
				return (
					<RankingStory
						rank={rank}
						totalUsers={totalUsers}
						percentile={percentile}
						rankedUsers={rankedUsers}
						currentUserId={userId!}
					/>
				);
			case 4:
				return (
					<BingeScoreStory
						averageSessionMinutes={averageSessionMinutes}
						totalPlays={totalPlays}
					/>
				);
			case 5:
				return (
					<LoyaltyStory
						showName={topShow!.showName}
						percentage={loyaltyPercentage}
					/>
				);
			case 6:
				return <TotalPlaysStory totalPlays={totalPlays} />;
			case 7:
				return (
					<FinaleStory
						userName={user.Name}
						totalHours={Math.round(totalMinutes / 60)}
						totalPlays={totalPlays}
						topShow={{
							name: topShow?.showName || "N/A",
							episodes: topShow?.playCount || 0,
						}}
						rank={rank}
						totalUsers={totalUsers}
						onRestart={() => goToStory(0)}
					/>
				);
			default:
				return <WelcomeStory userName={user.Name} />;
		}
	};

	return (
		<div
			className="min-h-screen bg-bg relative"
			onTouchStart={onTouchStart}
			onTouchMove={onTouchMove}
			onTouchEnd={onTouchEnd}
		>
			<StoryProgress
				total={totalStories}
				current={currentStory}
				onSelect={goToStory}
			/>

			<div className="h-screen flex items-center justify-center">
				<StoryContainer direction={direction} currentStory={currentStory}>
					{renderStory()}
				</StoryContainer>
			</div>

			{/* Navigation hint */}
			<div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-4 text-text-tertiary text-sm">
				<span>← Swipe or use arrows →</span>
			</div>
		</div>
	);
}
