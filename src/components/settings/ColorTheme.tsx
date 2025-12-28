"use client";

import { useThemeStore } from "@/store/useThemeStore";
import { Card } from "@/components/ui";

export default function ColorTheme() {
  const { theme, toggleTheme, setTheme } = useThemeStore();

  const themeOptions = [
    {
      id: "light",
      name: "Light",
      description: "Clean and bright interface",
      preview: "bg-white border-2 border-gray-200",
    },
    {
      id: "dark",
      name: "Dark",
      description: "Easy on the eyes in low light",
      preview: "bg-gray-900 border-2 border-gray-700",
    },
  ];

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-[var(--foreground)]">
            Color Theme
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Choose your preferred color scheme for the interface
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {themeOptions.map((option) => (
              <div
                key={option.id}
                className={`
                  relative cursor-pointer rounded-lg border-2 p-4 transition-all
                  ${theme === option.id
                    ? "border-primary-400 bg-primary-400/5"
                    : "border-[var(--border)] hover:border-[var(--muted)]"
                  }
                `}
                onClick={() => setTheme(option.id as "light" | "dark")}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`
                      w-4 h-4 rounded-full border-2 mt-1 transition-colors
                      ${theme === option.id
                        ? "border-primary-400 bg-primary-400"
                        : "border-[var(--muted-foreground)]"
                      }
                    `}
                  >
                    {theme === option.id && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[var(--foreground)] mb-1">
                      {option.name}
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)] mb-3">
                      {option.description}
                    </p>
                    
                    <div className="flex gap-2">
                      <div className={`w-8 h-6 rounded ${option.preview}`}></div>
                      <div className="w-8 h-6 rounded bg-[var(--background)] border border-[var(--border)]"></div>
                      <div className="w-8 h-6 rounded bg-[var(--foreground)]"></div>
                    </div>
                  </div>
                </div>

                {theme === option.id && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 rounded-full bg-primary-400"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">
                Current Theme
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">
                {theme === "light" ? "Light mode is active" : "Dark mode is active"}
              </p>
            </div>
            
            <button
              onClick={toggleTheme}
              className="
                flex items-center gap-2 px-4 py-2 rounded-lg
                bg-[var(--muted)] hover:bg-[var(--muted)]/80
                text-[var(--foreground)] transition-colors
                text-sm font-medium
              "
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {theme === "light" ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                )}
              </svg>
              Switch to {theme === "light" ? "Dark" : "Light"}
            </button>
          </div>
        </div>

        <div className="bg-[var(--muted)]/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-[var(--foreground)] mb-2">
            Theme Preview
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary-400"></div>
              <span className="text-sm text-[var(--muted-foreground)]">
                Primary color
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded bg-[var(--background)] border border-[var(--border)]"></div>
              <span className="text-sm text-[var(--muted-foreground)]">
                Background
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded bg-[var(--card)] border border-[var(--border)]"></div>
              <span className="text-sm text-[var(--muted-foreground)]">
                Card surface
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
