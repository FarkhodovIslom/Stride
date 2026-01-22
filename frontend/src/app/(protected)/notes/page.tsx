"use client";

import { useTranslation } from "@/lib/i18n";

export default function NotesPage() {
    const { t } = useTranslation();

    return (
        <div className="flex h-full items-center justify-center">
            <div className="text-center">
                <svg
                    className="w-16 h-16 mx-auto mb-4 text-[var(--muted-foreground)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                    Notes Page
                </h2>
                <p className="text-[var(--muted-foreground)]">
                    This feature is under construction
                </p>
            </div>
        </div>
    );
}
