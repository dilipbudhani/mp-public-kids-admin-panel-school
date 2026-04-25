import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import GalleryView from '@/components/gallery/GalleryView';
import { dbConnect } from "@/lib/mongodb";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'School Gallery | MP Kids School',
    description: 'Explore the vibrant campus life, events, sports, and academic achievements of MP Kids School through our image and video gallery.',
};

export default async function GalleryPage() {
    await dbConnect();

    // Import models after dbConnect to ensure they are registered in Mongoose
    const { default: Gallery } = await import('@/models/Gallery');
    const { default: StaticPage } = await import('@/models/StaticPage');

    const pageData = await StaticPage.findOne({ slug: "gallery", schoolIds: process.env.SCHOOL_ID }).lean() as any;

    // Fetch all gallery items, sorted by date (newest first)
    const items = await Gallery.find({ schoolIds: process.env.SCHOOL_ID }).sort({ date: -1 }).lean();

    // Serialize for Client Component
    const serializedItems = JSON.parse(JSON.stringify(items));

    return (
        <main className="min-h-screen bg-surface">
            <PageHeader
                title={pageData?.title || "Capturing Moments"}
                description={pageData?.description || "A visual journey through the vibrant life, achievements, and spirit of MP Kids School."}
                dark={true}
            />

            <GalleryView initialItems={serializedItems} />
        </main>
    );
}
