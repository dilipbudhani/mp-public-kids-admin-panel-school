import React from 'react';
import { dbConnect } from '@/lib/mongodb';
import Circular from '@/models/Circular';
import NoticeList from '@/components/notices/NoticeList';
import PageHeader from '@/components/ui/PageHeader';
import StaticPage, { IStaticPage } from '@/models/StaticPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'School Notices | MP Public School',
    description: 'Stay updated with the latest official announcements, circulars, and events from MP Public School.',
};

export default async function NoticesPage() {
    await dbConnect();

    const pageData = await StaticPage.findOne({ slug: "notices-page", schoolIds: process.env.SCHOOL_ID }).lean() as IStaticPage | null;
    const title = pageData?.title || "School Notice Board";
    const description = pageData?.description || "Access all official announcements, circulars, and events. Keep track of academic schedules and school happenings in real-time.";

    const noticesData = await Circular.find({ isActive: true, schoolIds: process.env.SCHOOL_ID })
        .sort({ date: -1 })
        .lean();

    // Serialize data for client components
    const notices = noticesData.map(notice => ({
        ...notice,
        _id: (notice as any)._id.toString(),
        date: (notice as any).date instanceof Date ? (notice as any).date.toISOString() : new Date().toISOString(),
    }));

    return (
        <main className="min-h-screen bg-surface">
            <PageHeader
                title={title}
                description={description}
                dark={true}
            />

            {/* Content Section */}
            <NoticeList initialNotices={notices} />
        </main>
    );
}
