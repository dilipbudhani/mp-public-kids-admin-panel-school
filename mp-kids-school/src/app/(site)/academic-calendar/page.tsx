import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import CalendarView from '@/components/calendar/CalendarView';
import { dbConnect } from "@/lib/mongodb";
import SchoolEvent from '@/models/SchoolEvent';
import StaticPage from '@/models/StaticPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Academic Calendar | MP Kids School',
    description: 'Yearly academic calendar, holidays, examination schedules, and school events for MP Kids School.',
};

export default async function AcademicCalendarPage() {
    await dbConnect();
    const pageData = await StaticPage.findOne({ slug: "academic-calendar", schoolIds: process.env.SCHOOL_ID }).lean();

    // Fetch events and sort by date
    const events = await SchoolEvent.find({ schoolIds: process.env.SCHOOL_ID }).sort({ date: 1 }).lean();

    // Serialize MongoDB objects for Client Component
    const serializedEvents = JSON.parse(JSON.stringify(events));

    return (
        <main className="min-h-screen bg-surface">
            <PageHeader
                title={pageData?.title || "Academic Calendar"}
                description={pageData?.description || "Our yearly roadmap for learning, celebrations, and achievements."}
                breadcrumb={[
                    { label: "Home", href: "/" },
                    { label: "Academics", href: "/academics" },
                    { label: "Academic Calendar", href: "/academic-calendar", active: true }
                ]}
                dark={true}
            />

            <CalendarView initialEvents={serializedEvents} />
        </main>
    );
}
