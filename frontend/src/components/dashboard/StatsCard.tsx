"use client";

import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  subtitle,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--muted-foreground)] mb-1">{title}</p>
          <p className="text-3xl font-bold text-[var(--foreground)]">{value}</p>
          {subtitle && (
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className="text-3xl opacity-80">{icon}</div>
      </div>
    </Card>
  );
}
