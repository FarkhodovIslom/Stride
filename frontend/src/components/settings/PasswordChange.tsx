"use client";

import { useState } from "react";
import { Button, Input, Card, useToast } from "@/components/ui";
import { PasswordStrengthIndicator } from "@/components/ui";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/lib/api";

interface PasswordValidation {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
}

export default function PasswordChange() {
    const toast = useToast();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errors, setErrors] = useState<{
        currentPassword?: string;
        newPassword?: string;
        confirmPassword?: string;
    }>({});

    const validatePassword = (password: string): PasswordValidation => ({
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });

    const getPasswordStrength = (password: string): number => {
        const validation = validatePassword(password);
        const passed = Object.values(validation).filter(Boolean).length;
        return Math.round((passed / 5) * 100);
    };

    const validate = (): boolean => {
        const newErrors: typeof errors = {};

        if (!currentPassword) {
            newErrors.currentPassword = "Current password is required";
        }

        if (!newPassword) {
            newErrors.newPassword = "New password is required";
        } else if (newPassword.length < 8) {
            newErrors.newPassword = "Password must be at least 8 characters";
        } else if (newPassword === currentPassword) {
            newErrors.newPassword = "New password must be different from current";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your new password";
        } else if (confirmPassword !== newPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await apiClient.patch(
                "/users/password",
                { currentPassword, newPassword },
                true
            );

            toast.success("Password changed successfully!");

            // Reset form
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setErrors({});
            setIsExpanded(false);
        } catch (err) {
            const message = (err as Error).message || "Failed to change password";
            toast.error(message);

            if (message.toLowerCase().includes("incorrect") || message.toLowerCase().includes("wrong")) {
                setErrors({ currentPassword: "Current password is incorrect" });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrors({});
        setIsExpanded(false);
    };

    const passwordValidation = validatePassword(newPassword);
    const passwordStrength = getPasswordStrength(newPassword);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
        >
            <Card className="p-6" role="region" aria-labelledby="password-heading">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-400/20 flex items-center justify-center">
                                <Lock className="w-5 h-5 text-primary-400" aria-hidden="true" />
                            </div>
                            <div>
                                <h2
                                    id="password-heading"
                                    className="text-2xl font-semibold text-[var(--foreground)]"
                                >
                                    Password
                                </h2>
                                <p className="text-sm text-[var(--muted-foreground)]">
                                    Manage your account password
                                </p>
                            </div>
                        </div>

                        {!isExpanded && (
                            <Button
                                variant="outline"
                                onClick={() => setIsExpanded(true)}
                                aria-expanded={isExpanded}
                                aria-controls="password-form"
                            >
                                Change Password
                            </Button>
                        )}
                    </div>

                    {isExpanded && (
                        <motion.form
                            id="password-form"
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4 pt-4 border-t border-[var(--border)]"
                        >
                            {/* Current Password */}
                            <div>
                                <label
                                    htmlFor="current-password"
                                    className="block text-sm font-medium text-[var(--muted-foreground)] mb-2"
                                >
                                    Current Password
                                </label>
                                <div className="relative max-w-md">
                                    <Input
                                        id="current-password"
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Enter current password"
                                        className={errors.currentPassword ? "border-red-500 pr-10" : "pr-10"}
                                        aria-invalid={!!errors.currentPassword}
                                        aria-describedby={errors.currentPassword ? "current-password-error" : undefined}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                                        aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                                    >
                                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.currentPassword && (
                                    <p id="current-password-error" className="text-sm text-red-500 mt-1" role="alert">
                                        {errors.currentPassword}
                                    </p>
                                )}
                            </div>

                            {/* New Password */}
                            <div>
                                <label
                                    htmlFor="new-password"
                                    className="block text-sm font-medium text-[var(--muted-foreground)] mb-2"
                                >
                                    New Password
                                </label>
                                <div className="relative max-w-md">
                                    <Input
                                        id="new-password"
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        className={errors.newPassword ? "border-red-500 pr-10" : "pr-10"}
                                        aria-invalid={!!errors.newPassword}
                                        aria-describedby="password-requirements"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                                    >
                                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.newPassword && (
                                    <p className="text-sm text-red-500 mt-1" role="alert">
                                        {errors.newPassword}
                                    </p>
                                )}

                                {/* Password Strength */}
                                {newPassword && (
                                    <div className="mt-3 max-w-md">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex-1 h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                                                <motion.div
                                                    className={`h-full rounded-full ${passwordStrength < 40 ? "bg-red-500" :
                                                            passwordStrength < 70 ? "bg-amber-500" :
                                                                "bg-green-500"
                                                        }`}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${passwordStrength}%` }}
                                                    transition={{ duration: 0.3 }}
                                                />
                                            </div>
                                            <span className="text-xs text-[var(--muted-foreground)]">
                                                {passwordStrength < 40 ? "Weak" :
                                                    passwordStrength < 70 ? "Medium" :
                                                        "Strong"}
                                            </span>
                                        </div>

                                        <ul id="password-requirements" className="text-xs space-y-1">
                                            {[
                                                { check: passwordValidation.minLength, text: "At least 8 characters" },
                                                { check: passwordValidation.hasUppercase, text: "One uppercase letter" },
                                                { check: passwordValidation.hasLowercase, text: "One lowercase letter" },
                                                { check: passwordValidation.hasNumber, text: "One number" },
                                                { check: passwordValidation.hasSpecial, text: "One special character" },
                                            ].map((req, i) => (
                                                <li
                                                    key={i}
                                                    className={`flex items-center gap-2 ${req.check ? "text-green-500" : "text-[var(--muted-foreground)]"}`}
                                                >
                                                    <ShieldCheck className={`w-3 h-3 ${req.check ? "opacity-100" : "opacity-30"}`} />
                                                    {req.text}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label
                                    htmlFor="confirm-password"
                                    className="block text-sm font-medium text-[var(--muted-foreground)] mb-2"
                                >
                                    Confirm New Password
                                </label>
                                <div className="relative max-w-md">
                                    <Input
                                        id="confirm-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                                        aria-invalid={!!errors.confirmPassword}
                                        aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p id="confirm-password-error" className="text-sm text-red-500 mt-1" role="alert">
                                        {errors.confirmPassword}
                                    </p>
                                )}
                                {confirmPassword && confirmPassword === newPassword && !errors.confirmPassword && (
                                    <p className="text-sm text-green-500 mt-1 flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3" /> Passwords match
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="min-w-[120px]"
                                >
                                    {isSubmitting ? "Changing..." : "Change Password"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </motion.form>
                    )}
                </div>
            </Card>
        </motion.div>
    );
}
