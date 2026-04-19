/**
 * Utility to handle school class progression
 */

export const CLASS_SUCCESSION: Record<string, string | null> = {
    "Nursery": "LKG",
    "LKG": "UKG",
    "UKG": "1",
    "1": "2",
    "2": "3",
    "3": "4",
    "4": "5",
    "5": "6",
    "6": "7",
    "7": "8",
    "8": "9",
    "9": "10",
    "10": "11",
    "11": "12",
    "12": null, // Graduation
};

export function getNextClass(currentClass: string): string | null {
    // Handle cases like "Class 1", "Class 10" or just "1", "10"
    const normalized = currentClass.replace(/class\s+/i, '').trim();
    return CLASS_SUCCESSION[normalized] || null;
}

export function getNextAcademicYear(currentYear: string): string {
    // Assuming format YYYY-YY (e.g., 2025-26)
    const match = currentYear.match(/(\d{4})-(\d{2})/);
    if (!match) return currentYear;

    const startYear = parseInt(match[1]);
    const endYearSuffix = parseInt(match[2]);

    const nextStart = startYear + 1;
    const nextEnd = (endYearSuffix + 1) % 100;

    return `${nextStart}-${nextEnd.toString().padStart(2, '0')}`;
}
