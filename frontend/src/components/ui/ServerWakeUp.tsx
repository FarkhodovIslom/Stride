"use client";

import { motion } from "framer-motion";
import { BookOpen, Sparkles, Target, Zap } from "lucide-react";
import { useEffect, useState } from "react";

// Random motivational messages about learning
const motivationalMessages = [
  { icon: BookOpen, text: "Preparing your learning journey..." },
  { icon: Sparkles, text: "Polishing your progress tracker..." },
  { icon: Target, text: "Setting up your goals..." },
  { icon: Zap, text: "Charging up your streak..." },
];

export default function ServerWakeUp() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Cycle through messages every 2 seconds
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % motivationalMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const currentMessage = motivationalMessages[messageIndex];
  const Icon = currentMessage.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-10"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -100],
              opacity: [0.1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeOut",
            }}
          >
            <BookOpen className="w-8 h-8 text-[var(--primary)]" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Book/Loading Icon */}
        <motion.div
          className="relative"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="w-24 h-24 rounded-full border-4 border-[var(--border)] border-t-[var(--primary)] border-r-[var(--primary)] border-b-transparent border-l-transparent" />
          
          {/* Inner pulsing circle */}
          <motion.div
            className="absolute inset-2 flex items-center justify-center"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-16 h-16 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
              <Icon className="w-8 h-8 text-[var(--primary)]" />
            </div>
          </motion.div>
        </motion.div>

        {/* Progress Dots */}
        <div className="flex gap-3 mt-8">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-[var(--primary)]"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Animated Message */}
        <motion.p
          key={messageIndex}
          className="mt-6 text-lg font-medium text-[var(--foreground)]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          {currentMessage.text}
        </motion.p>

        {/* Subtle hint */}
        <motion.p
          className="mt-3 text-sm text-[var(--muted-foreground)]"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          First requests take a moment • We're worth the wait
        </motion.p>
      </div>
    </div>
  );
}

