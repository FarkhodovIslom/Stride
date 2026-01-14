"use client";

import { Card } from "@/components/ui";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";

interface StreakDisplayProps {
  streak: number;
  "aria-label"?: string;
}

export default function StreakDisplay({ streak, "aria-label": ariaLabel }: StreakDisplayProps) {
  const getMessage = () => {
    if (streak === 0) return "Start your streak today!";
    if (streak === 1) return "Great start!";
    if (streak < 7) return "Keep going!";
    if (streak < 30) return "Awesome streak!";
    return "Legendary!";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: 0.15 }}
    >
      <Card
        className="relative overflow-hidden bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20 group hover:shadow-lg transition-shadow"
        role="article"
        aria-label={ariaLabel || `Learning streak: ${streak} days. ${getMessage()}`}
      >
        <div className="flex items-center gap-4">
          <motion.div
            className="w-16 h-16 text-orange-500"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            aria-hidden="true"
          >
            <Flame className="w-full h-full" />
          </motion.div>
          <div>
            <p className="text-sm text-[var(--muted-foreground)]">
              Learning Streak
            </p>
            <motion.p
              className="text-4xl font-bold text-[var(--foreground)]"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              {streak} <span className="text-lg font-normal">days</span>
            </motion.p>
            <p className="text-sm text-orange-500 mt-1" aria-live="polite">
              {getMessage()}
            </p>
          </div>
        </div>
        {/* Streak tooltip */}
        <div
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          role="tooltip"
        >
          <span className="text-xs text-[var(--muted-foreground)] bg-[var(--background)] px-2 py-1 rounded-full shadow-sm">
            Keep learning daily!
          </span>
        </div>
      </Card>
    </motion.div>
  );
}
