interface PasswordStrengthIndicatorProps {
    password: string;
}

export function PasswordStrengthIndicator({
    password,
}: PasswordStrengthIndicatorProps) {
    const getPasswordStrength = (pwd: string): {
        score: number;
        label: string;
        color: string;
    } => {
        if (!pwd) return { score: 0, label: "", color: "" };

        let score = 0;

        // Length check
        if (pwd.length >= 8) score++;
        if (pwd.length >= 12) score++;

        // Character variety checks
        if (/[a-z]/.test(pwd)) score++; // lowercase
        if (/[A-Z]/.test(pwd)) score++; // uppercase
        if (/[0-9]/.test(pwd)) score++; // numbers
        if (/[^a-zA-Z0-9]/.test(pwd)) score++; // special chars

        // Determine strength
        if (score <= 2) return { score: 1, label: "Weak", color: "text-red-500" };
        if (score <= 4) return { score: 2, label: "Fair", color: "text-orange-500" };
        if (score <= 5) return { score: 3, label: "Good", color: "text-yellow-500" };
        return { score: 4, label: "Strong", color: "text-green-500" };
    };

    const strength = getPasswordStrength(password);

    if (!password) return null;

    return (
        <div className="mt-2 space-y-2">
            <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                    <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${level <= strength.score
                                ? strength.score === 1
                                    ? "bg-red-500"
                                    : strength.score === 2
                                        ? "bg-orange-500"
                                        : strength.score === 3
                                            ? "bg-yellow-500"
                                            : "bg-green-500"
                                : "bg-[var(--border)]"
                            }`}
                    />
                ))}
            </div>
            <p className={`text-xs font-medium ${strength.color}`}>
                Password strength: {strength.label}
            </p>
            {strength.score < 3 && (
                <p className="text-xs text-[var(--muted-foreground)]">
                    Use 8+ characters with a mix of letters, numbers & symbols
                </p>
            )}
        </div>
    );
}
