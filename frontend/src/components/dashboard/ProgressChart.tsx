"use client";

import { Card } from "@/components/ui";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

interface ProgressChartProps {
  completed: number;
  total: number;
}

export default function ProgressChart({ completed, total }: ProgressChartProps) {
  const remaining = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const data = [
    { name: "Completed", value: completed },
    { name: "Remaining", value: remaining || (total === 0 ? 1 : 0) },
  ];

  const COLORS = ["hsl(var(--primary))", "var(--muted)"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card
        className="hover:shadow-lg transition-shadow"
        role="figure"
        aria-label={`Overall progress: ${completed} of ${total} lessons completed (${percentage}%)`}
      >
        <h3
          className="font-semibold text-[var(--foreground)] mb-4"
          id="progress-chart-title"
        >
          Overall Progress
        </h3>
        <div className="flex items-center gap-6">
          <div
            className="relative w-32 h-32"
            role="img"
            aria-describedby="progress-chart-title progress-chart-summary"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={50}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                  animationBegin={0}
                  animationDuration={800}
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                className="text-2xl font-bold text-[var(--foreground)]"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                {percentage}%
              </motion.span>
            </div>
          </div>
          <div className="flex-1" id="progress-chart-summary">
            <div className="space-y-2">
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <div
                  className="w-3 h-3 rounded-full bg-primary-400"
                  aria-hidden="true"
                />
                <span className="text-sm text-[var(--muted-foreground)]">
                  Completed: <strong className="text-[var(--foreground)]">{completed}</strong>
                </span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <div
                  className="w-3 h-3 rounded-full bg-[var(--muted)]"
                  aria-hidden="true"
                />
                <span className="text-sm text-[var(--muted-foreground)]">
                  Remaining: <strong className="text-[var(--foreground)]">{remaining}</strong>
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
