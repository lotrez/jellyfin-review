import { useState, useEffect, useCallback } from "react";

interface UseStoryNavigationProps {
  totalStories: number;
  onComplete?: () => void;
}

export function useStoryNavigation({
  totalStories,
  onComplete,
}: UseStoryNavigationProps) {
  const [currentStory, setCurrentStory] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  const nextStory = useCallback(() => {
    if (currentStory < totalStories - 1) {
      setDirection(1);
      setCurrentStory((prev) => prev + 1);
    } else {
      onComplete?.();
    }
  }, [currentStory, totalStories, onComplete]);

  const prevStory = useCallback(() => {
    if (currentStory > 0) {
      setDirection(-1);
      setCurrentStory((prev) => prev - 1);
    }
  }, [currentStory]);

  const goToStory = useCallback((index: number) => {
    if (index >= 0 && index < totalStories) {
      setDirection(index > currentStory ? 1 : -1);
      setCurrentStory(index);
    }
  }, [currentStory, totalStories]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextStory();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevStory();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextStory, prevStory]);

  const progress = ((currentStory + 1) / totalStories) * 100;

  return {
    currentStory,
    direction,
    nextStory,
    prevStory,
    goToStory,
    progress,
    isFirst: currentStory === 0,
    isLast: currentStory === totalStories - 1,
  };
}
