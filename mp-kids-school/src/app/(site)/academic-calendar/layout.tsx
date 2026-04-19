import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Academic Calendar | MP Kids School',
    description: 'View the official MP Kids School academic calendar for the session 2025-26. Plan around exams, holidays, school events, and parent-teacher meetings.',
    keywords: 'academic calendar, school holidays, exam schedule, PTM dates, school events calendar, MP Kids School schedule',
};

export default function AcademicCalendarLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
