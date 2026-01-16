"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
    value?: string;
    onChange: (value: string | null) => void;
    placeholder?: string;
    className?: string;
    showTime?: boolean;
}

export default function DateTimePicker({
    value,
    onChange,
    placeholder = "Set deadline...",
    className,
    showTime = false,
}: DateTimePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const formatDisplayDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const isToday = date.toDateString() === now.toDateString();
        const isTomorrow = date.toDateString() === tomorrow.toDateString();
        const isPast = date < now && !isToday;

        let display = "";
        if (isToday) display = "Today";
        else if (isTomorrow) display = "Tomorrow";
        else display = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

        if (showTime) {
            display += `, ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
        }

        return { display, isPast, isToday };
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null);
    };

    const displayInfo = value ? formatDisplayDate(value) : null;

    return (
        <div ref={containerRef} className={cn("relative", className)}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-[var(--border)]",
                    "bg-[var(--background)] hover:bg-[var(--muted)] transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-primary-400/50",
                    displayInfo?.isPast && "text-[var(--destructive)] border-[var(--destructive)]/30",
                    displayInfo?.isToday && "text-amber-600 dark:text-amber-400 border-amber-500/30"
                )}
            >
                {/* Calendar Icon */}
                <svg
                    className="w-4 h-4 text-[var(--muted-foreground)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
                <span className={displayInfo ? "" : "text-[var(--muted-foreground)]"}>
                    {displayInfo?.display || placeholder}
                </span>
                {value && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="p-0.5 rounded hover:bg-[var(--muted-foreground)]/20"
                        aria-label="Clear date"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 mt-1 p-3 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg min-w-[200px]">
                    <input
                        type={showTime ? "datetime-local" : "date"}
                        value={value ? value.slice(0, showTime ? 16 : 10) : ""}
                        onChange={(e) => {
                            if (e.target.value) {
                                const date = new Date(e.target.value);
                                onChange(date.toISOString());
                            }
                            setIsOpen(false);
                        }}
                        className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/50"
                    />

                    {/* Quick Actions */}
                    <div className="flex gap-2 mt-3">
                        <button
                            type="button"
                            onClick={() => {
                                const today = new Date();
                                today.setHours(23, 59, 0, 0);
                                onChange(today.toISOString());
                                setIsOpen(false);
                            }}
                            className="flex-1 px-2 py-1.5 text-xs bg-[var(--muted)] hover:bg-[var(--muted-foreground)]/20 rounded transition-colors"
                        >
                            Today
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const tomorrow = new Date();
                                tomorrow.setDate(tomorrow.getDate() + 1);
                                tomorrow.setHours(23, 59, 0, 0);
                                onChange(tomorrow.toISOString());
                                setIsOpen(false);
                            }}
                            className="flex-1 px-2 py-1.5 text-xs bg-[var(--muted)] hover:bg-[var(--muted-foreground)]/20 rounded transition-colors"
                        >
                            Tomorrow
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const nextWeek = new Date();
                                nextWeek.setDate(nextWeek.getDate() + 7);
                                nextWeek.setHours(23, 59, 0, 0);
                                onChange(nextWeek.toISOString());
                                setIsOpen(false);
                            }}
                            className="flex-1 px-2 py-1.5 text-xs bg-[var(--muted)] hover:bg-[var(--muted-foreground)]/20 rounded transition-colors"
                        >
                            +1 Week
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
