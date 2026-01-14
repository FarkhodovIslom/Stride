"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card, ErrorMessage, PasswordStrengthIndicator } from "@/components/ui";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

type AuthMode = "login" | "register" | "forgot-password";

// Email validation function
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Password validation function
const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  return null;
};

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuthStore();
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    name?: string;
  }>({});

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
    // Clear field error when user starts typing
    setFieldErrors({ ...fieldErrors, [name]: undefined });
  };

  const validateForm = (): boolean => {
    const errors: typeof fieldErrors = {};

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (mode === "register") {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        errors.password = passwordError;
      }
    }

    // Name validation for register
    if (mode === "register" && !formData.name.trim()) {
      errors.name = "Name is required";
    }

    // Password confirmation for register
    if (mode === "register") {
      if (!formData.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Client-side validation
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      if (mode === "register") {
        await register(formData.email, formData.password, formData.name);
        router.push("/dashboard");
      } else if (mode === "login") {
        await login(formData.email, formData.password);
        router.push("/dashboard");
      } else if (mode === "forgot-password") {
        // TODO: Implement forgot password API call
        setError("Password reset functionality coming soon!");
        setIsLoading(false);
        return;
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError("");
    setFieldErrors({});
    // Reset form data when switching modes
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    });
  };

  const getTitle = () => {
    switch (mode) {
      case "login":
        return "Welcome back";
      case "register":
        return "Create your account";
      case "forgot-password":
        return "Reset your password";
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case "login":
        return "Sign in to continue your learning journey";
      case "register":
        return "Start tracking your progress today";
      case "forgot-password":
        return "We'll send you a reset link";
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block" aria-label="Go to homepage">
            <BookOpen className="w-10 h-10 text-primary-400" aria-hidden="true" />
          </Link>
          <h1 className="text-2xl font-bold text-[var(--foreground)] mt-4">
            {getTitle()}
          </h1>
          <p className="text-[var(--muted-foreground)] mt-2">
            {getSubtitle()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {mode === "register" && (
            <Input
              id="name"
              name="name"
              type="text"
              label="Name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              error={fieldErrors.name}
              required
              aria-required="true"
            />
          )}

          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            error={fieldErrors.email}
            required
            aria-required="true"
          />

          {mode !== "forgot-password" && (
            <>
              <Input
                id="password"
                name="password"
                type="password"
                label="Password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={fieldErrors.password}
                required
                showPasswordToggle
                aria-required="true"
              />

              {mode === "register" && formData.password && (
                <PasswordStrengthIndicator password={formData.password} />
              )}

              {mode === "register" && (
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={fieldErrors.confirmPassword}
                  required
                  showPasswordToggle
                  aria-required="true"
                />
              )}

              {mode === "login" && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => switchMode("forgot-password")}
                    className="text-sm text-primary-400 hover:text-primary-500 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </>
          )}

          <ErrorMessage message={error} />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {mode === "login" && "Sign In"}
            {mode === "register" && "Create Account"}
            {mode === "forgot-password" && "Send Reset Link"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          {mode === "forgot-password" ? (
            <p className="text-sm text-[var(--muted-foreground)]">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="text-primary-400 hover:text-primary-500 font-medium transition-colors"
                aria-label="Go back to sign in"
              >
                Sign in
              </button>
            </p>
          ) : (
            <p className="text-sm text-[var(--muted-foreground)]">
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => switchMode(mode === "login" ? "register" : "login")}
                className="text-primary-400 hover:text-primary-500 font-medium transition-colors"
                aria-label={mode === "login" ? "Create a new account" : "Sign in to existing account"}
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          )}
        </div>
      </Card>
    </main>
  );
}
