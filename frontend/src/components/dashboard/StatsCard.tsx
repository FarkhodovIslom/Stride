"use client";

import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  className?: string;
  "aria-label"?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  subtitle,
  className,
  "aria-label": ariaLabel,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card
        className={cn("relative overflow-hidden group hover:shadow-lg transition-shadow", className)}
        role="article"
        aria-label={ariaLabel || `${title}: ${value}${subtitle ? `, ${subtitle}` : ""}`}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-[var(--muted-foreground)] mb-1" id={`stat-title-${title.replace(/\s+/g, '-')}`}>
              {title}
            </p>
            <motion.p
              className="text-3xl font-bold text-[var(--foreground)]"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              {value}
            </motion.p>
            {subtitle && (
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <div
            className="text-3xl opacity-80 group-hover:scale-110 transition-transform"
            aria-hidden="true"
          >
            {icon}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
