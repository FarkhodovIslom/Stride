"use client";

import { Card } from "@/components/ui";

interface StreakDisplayProps {
  streak: number;
}

export default function StreakDisplay({ streak }: StreakDisplayProps) {
  const getMessage = () => {
    if (streak === 0) return "Start your streak today!";
    if (streak === 1) return "Great start!";
    if (streak < 7) return "Keep going!";
    if (streak < 30) return "Awesome streak!";
    return "Legendary!";
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
      <div className="flex items-center gap-4">
        <div className="text-5xl">🔥</div>
        <div>
          <p className="text-sm text-[var(--muted-foreground)]">
            Learning Streak
          </p>
          <p className="text-4xl font-bold text-[var(--foreground)]">
            {streak} <span className="text-lg font-normal">days</span>
          </p>
          <p className="text-sm text-orange-500 mt-1">{getMessage()}</p>
        </div>
      </div>
    </Card>
  );
}
