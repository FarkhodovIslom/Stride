"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextValue {
    showToast: (type: ToastType, message: string, duration?: number) => void;
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
};

const styles = {
    success: "bg-green-500/10 border-green-500/20 text-green-500",
    error: "bg-red-500/10 border-red-500/20 text-red-500",
    warning: "bg-amber-500/10 border-amber-500/20 text-amber-500",
    info: "bg-blue-500/10 border-blue-500/20 text-blue-500",
};

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    const Icon = icons[toast.type];

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`
        flex items-center gap-3 p-4 rounded-lg border shadow-lg
        bg-[var(--card)] backdrop-blur-sm min-w-[300px] max-w-[400px]
        ${styles[toast.type]}
      `}
            role="alert"
            aria-live="polite"
        >
            <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
            <p className="text-sm text-[var(--foreground)] flex-1">{toast.message}</p>
            <button
                onClick={onClose}
                className="p-1 rounded hover:bg-[var(--muted)] transition-colors"
                aria-label="Close notification"
            >
                <X className="w-4 h-4 text-[var(--muted-foreground)]" />
            </button>
        </motion.div>
    );
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback(
        (type: ToastType, message: string, duration = 4000) => {
            const id = `${Date.now()}-${Math.random()}`;
            const toast: Toast = { id, type, message, duration };

            setToasts((prev) => [...prev, toast]);

            if (duration > 0) {
                setTimeout(() => removeToast(id), duration);
            }
        },
        [removeToast]
    );

    const success = useCallback(
        (message: string, duration?: number) => showToast("success", message, duration),
        [showToast]
    );

    const error = useCallback(
        (message: string, duration?: number) => showToast("error", message, duration),
        [showToast]
    );

    const warning = useCallback(
        (message: string, duration?: number) => showToast("warning", message, duration),
        [showToast]
    );

    const info = useCallback(
        (message: string, duration?: number) => showToast("info", message, duration),
        [showToast]
    );

    return (
        <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
            {children}
            <div
                className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
                aria-label="Notifications"
            >
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <ToastItem
                            key={toast.id}
                            toast={toast}
                            onClose={() => removeToast(toast.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export default ToastProvider;
