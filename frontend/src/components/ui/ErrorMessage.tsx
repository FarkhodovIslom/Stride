import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
    message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
    if (!message) return null;

    return (
        <div
            role="alert"
            aria-live="polite"
            className="p-3 rounded-lg bg-[var(--destructive)]/10 text-[var(--destructive)] text-sm flex items-start gap-2"
        >
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{message}</span>
        </div>
    );
}
