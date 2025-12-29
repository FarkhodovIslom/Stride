"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <label
        htmlFor={id}
        className={cn(
          "flex items-center gap-3 cursor-pointer select-none",
          className
        )}
      >
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              "w-5 h-5 rounded border-2 transition-all duration-200",
              "border-[var(--border)] bg-[var(--background)]",
              "peer-checked:border-primary-400 peer-checked:bg-primary-400",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-primary-400/20"
            )}
          />
          <svg
            className={cn(
              "absolute top-0.5 left-0.5 w-4 h-4 text-gray-900",
              "opacity-0 peer-checked:opacity-100 transition-opacity duration-200",
              "pointer-events-none"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        {label && (
          <span className="text-sm text-[var(--foreground)]">{label}</span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
