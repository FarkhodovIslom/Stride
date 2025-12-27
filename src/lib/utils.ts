import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function calculateStreak(completedDates: Date[]): number {
  if (completedDates.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sortedDates = completedDates
    .map((d) => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
    .sort((a, b) => b - a);

  const uniqueDates = [...new Set(sortedDates)];

  const todayTime = today.getTime();
  const yesterdayTime = todayTime - 24 * 60 * 60 * 1000;

  if (uniqueDates[0] !== todayTime && uniqueDates[0] !== yesterdayTime) {
    return 0;
  }

  let streak = 0;
  let currentDate = uniqueDates[0] === todayTime ? todayTime : yesterdayTime;

  for (const date of uniqueDates) {
    if (date === currentDate) {
      streak++;
      currentDate -= 24 * 60 * 60 * 1000;
    } else if (date < currentDate) {
      break;
    }
  }

  return streak;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
