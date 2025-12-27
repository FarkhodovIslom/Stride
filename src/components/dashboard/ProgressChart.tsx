"use client";

import { Card } from "@/components/ui";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

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

  const COLORS = ["#FACC15", "var(--muted)"];

  return (
    <Card>
      <h3 className="font-semibold text-[var(--foreground)] mb-4">
        Overall Progress
      </h3>
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32">
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
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-[var(--foreground)]">
              {percentage}%
            </span>
          </div>
        </div>
        <div className="flex-1">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary-400" />
              <span className="text-sm text-[var(--muted-foreground)]">
                Completed: {completed}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--muted)]" />
              <span className="text-sm text-[var(--muted-foreground)]">
                Remaining: {remaining}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
