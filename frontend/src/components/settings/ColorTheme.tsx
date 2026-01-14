"use client";

import { useThemeStore, type ThemeMode } from "@/store/useThemeStore";
import { Card, useToast } from "@/components/ui";
import { Sun, Moon, Monitor } from "lucide-react";
import { motion } from "framer-motion";

export default function ColorTheme() {
  const { theme, resolvedTheme, setTheme } = useThemeStore();
  const toast = useToast();

  const themeOptions: { id: ThemeMode; name: string; description: string; icon: typeof Sun }[] = [
    {
      id: "light",
      name: "Light",
      description: "Clean and bright interface",
      icon: Sun,
    },
    {
      id: "dark",
      name: "Dark",
      description: "Easy on the eyes in low light",
      icon: Moon,
    },
    {
      id: "system",
      name: "System",
      description: "Follow your device settings",
      icon: Monitor,
    },
  ];

  const handleThemeChange = (newTheme: ThemeMode) => {
    if (newTheme !== theme) {
      setTheme(newTheme);
      const message = newTheme === "system"
        ? "Using system theme preference"
        : `Switched to ${newTheme} mode`;
      toast.success(message);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, themeId: ThemeMode) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleThemeChange(themeId);
    }
    // Arrow key navigation
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const currentIndex = themeOptions.findIndex(o => o.id === themeId);
      const nextIndex = (currentIndex + 1) % themeOptions.length;
      const nextElement = document.querySelector(`[data-theme="${themeOptions[nextIndex].id}"]`) as HTMLElement;
      nextElement?.focus();
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const currentIndex = themeOptions.findIndex(o => o.id === themeId);
      const prevIndex = (currentIndex - 1 + themeOptions.length) % themeOptions.length;
      const prevElement = document.querySelector(`[data-theme="${themeOptions[prevIndex].id}"]`) as HTMLElement;
      prevElement?.focus();
    }
  };

  const getPreviewClasses = (themeId: ThemeMode): string => {
    switch (themeId) {
      case "light":
        return "bg-white border-2 border-gray-200";
      case "dark":
        return "bg-gray-900 border-2 border-gray-700";
      case "system":
        return "bg-gradient-to-r from-white to-gray-900 border-2 border-gray-400";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="p-6" role="region" aria-labelledby="theme-heading">
        <div className="space-y-6">
          <div>
            <h2
              id="theme-heading"
              className="text-2xl font-semibold text-[var(--foreground)]"
            >
              Color Theme
            </h2>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              Choose your preferred color scheme for the interface
            </p>
          </div>

          <div className="space-y-4">
            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              role="radiogroup"
              aria-label="Color theme options"
            >
              {themeOptions.map((option, index) => {
                const Icon = option.icon;
                const isSelected = theme === option.id;

                return (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <div
                      role="radio"
                      aria-checked={isSelected}
                      tabIndex={isSelected ? 0 : -1}
                      data-theme={option.id}
                      onKeyDown={(e) => handleKeyDown(e, option.id)}
                      onClick={() => handleThemeChange(option.id)}
                      className={`
                        relative cursor-pointer rounded-lg border-2 p-4 transition-all h-full
                        focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2
                        ${isSelected
                          ? "border-primary-400 bg-primary-400/5"
                          : "border-[var(--border)] hover:border-[var(--muted)]"
                        }
                      `}
                    >
                      <div className="flex flex-col items-center text-center gap-3">
                        <div
                          className={`
                            w-12 h-12 rounded-full flex items-center justify-center transition-colors
                            ${isSelected
                              ? "bg-primary-400/20 text-primary-400"
                              : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                            }
                          `}
                          aria-hidden="true"
                        >
                          <Icon className="w-6 h-6" />
                        </div>

                        <div>
                          <h3 className="font-medium text-[var(--foreground)] mb-1">
                            {option.name}
                          </h3>
                          <p className="text-xs text-[var(--muted-foreground)]">
                            {option.description}
                          </p>
                        </div>

                        <div className="flex gap-1" aria-hidden="true">
                          <div className={`w-6 h-4 rounded ${getPreviewClasses(option.id)}`}></div>
                        </div>
                      </div>

                      {isSelected && (
                        <motion.div
                          className="absolute top-2 right-2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          aria-hidden="true"
                        >
                          <div className="w-2.5 h-2.5 rounded-full bg-primary-400"></div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  Current Theme
                </p>
                <p className="text-sm text-[var(--muted-foreground)]" aria-live="polite">
                  {theme === "system"
                    ? `System (${resolvedTheme} mode active)`
                    : `${theme.charAt(0).toUpperCase() + theme.slice(1)} mode is active`
                  }
                </p>
              </div>

              <button
                onClick={() => {
                  const newTheme = resolvedTheme === "light" ? "dark" : "light";
                  setTheme(newTheme);
                  toast.success(`Switched to ${newTheme} mode`);
                }}
                className="
                  flex items-center gap-2 px-4 py-2 rounded-lg
                  bg-[var(--muted)] hover:bg-[var(--muted)]/80
                  text-[var(--foreground)] transition-colors
                  text-sm font-medium
                  focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2
                "
                aria-label={`Switch to ${resolvedTheme === "light" ? "dark" : "light"} mode`}
              >
                {resolvedTheme === "light" ? (
                  <Moon className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Sun className="w-4 h-4" aria-hidden="true" />
                )}
                Switch to {resolvedTheme === "light" ? "Dark" : "Light"}
              </button>
            </div>
          </div>

          <div className="bg-[var(--muted)]/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-[var(--foreground)] mb-2">
              Theme Preview
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary-400" aria-hidden="true"></div>
                <span className="text-sm text-[var(--muted-foreground)]">
                  Primary color
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded bg-[var(--background)] border border-[var(--border)]" aria-hidden="true"></div>
                <span className="text-sm text-[var(--muted-foreground)]">
                  Background
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded bg-[var(--card)] border border-[var(--border)]" aria-hidden="true"></div>
                <span className="text-sm text-[var(--muted-foreground)]">
                  Card surface
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
