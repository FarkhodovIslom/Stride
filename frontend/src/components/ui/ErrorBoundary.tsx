"use client";

import React from "react";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error to console (could be sent to error reporting service)
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[400px] flex items-center justify-center p-8">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                            Something went wrong
                        </h2>
                        <p className="text-[var(--muted-foreground)] mb-6">
                            {this.state.error?.message ||
                                "An unexpected error occurred. Please try again."}
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={this.handleRetry}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-400 text-gray-900 font-medium rounded-lg hover:bg-primary-500 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </button>
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--border)] text-[var(--foreground)] font-medium rounded-lg hover:bg-[var(--muted)] transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                Go Home
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * Dashboard-specific error fallback component
 */
export function DashboardErrorFallback({
    error,
    resetError,
}: {
    error?: Error;
    resetError?: () => void;
}) {
    return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
            <div className="text-center max-w-md">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                    Dashboard Error
                </h2>
                <p className="text-[var(--muted-foreground)] mb-6">
                    {error?.message ||
                        "Failed to load dashboard. Please try refreshing the page."}
                </p>
                <div className="flex gap-4 justify-center">
                    {resetError && (
                        <button
                            onClick={resetError}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-400 text-gray-900 font-medium rounded-lg hover:bg-primary-500 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Retry
                        </button>
                    )}
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--border)] text-[var(--foreground)] font-medium rounded-lg hover:bg-[var(--muted)] transition-colors"
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ErrorBoundary;
