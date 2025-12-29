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

export function validatePassword(password: string): boolean {
    return password.length >= 6;
}
