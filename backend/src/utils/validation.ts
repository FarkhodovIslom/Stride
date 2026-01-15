/**
 * Calculate learning streak based on completed lesson dates
 */
export function calculateStreak(completedDates: Date[]): number {
    if (completedDates.length === 0) return 0;

    // Sort dates in descending order
    const sortedDates = completedDates
        .map((date) => new Date(date))
        .sort((a, b) => b.getTime() - a.getTime());

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if the most recent completion was today or yesterday
    const mostRecent = new Date(sortedDates[0]);
    mostRecent.setHours(0, 0, 0, 0);

    if (mostRecent < yesterday) {
        return 0; // Streak broken
    }

    let streak = 0;
    let currentDate = new Date(today);

    // Count consecutive days
    for (const completedDate of sortedDates) {
        const checkDate = new Date(completedDate);
        checkDate.setHours(0, 0, 0, 0);

        if (checkDate.getTime() === currentDate.getTime()) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else if (checkDate < currentDate) {
            // Gap in dates, check if it's the next expected date
            const expectedDate = new Date(currentDate);
            expectedDate.setDate(expectedDate.getDate() - 1);

            if (checkDate.getTime() === expectedDate.getTime()) {
                streak++;
                currentDate = new Date(checkDate);
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break; // Gap found, stop counting
            }
        }
    }

    return streak;
}

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export interface PasswordValidation {
    isValid: boolean;
    errors: string[];
}

/**
 * Validates password strength with comprehensive rules
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export function validatePasswordStrength(password: string): PasswordValidation {
    const errors: string[] = [];
    
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * @deprecated Use validatePasswordStrength for detailed validation
 * Kept for backward compatibility
 */
export function validatePassword(password: string): boolean {
    return validatePasswordStrength(password).isValid;
}
