import React from 'react';
import { dbConnect } from '@/lib/mongodb';
import News from '@/models/News';
import NewsList from '@/components/news/NewsList';

export const metadata = {
    title: 'School News & Updates | MP Kids School',
    description: 'Keep up with the latest happenings, achievements, and announcements from the MP Kids School community.',
};

export default async function NewsPage() {
    await dbConnect();

    const newsData = await News.find({ isPublished: true, schoolIds: 'mp-kids-school' })
        .sort({ date: -1 })
        .lean();

    // Serialize data for client components
    const news = newsData.map(item => ({
        ...item,
        _id: (item as any)._id.toString(),
        publishedAt: (item as any).date instanceof Date ? (item as any).date.toISOString() : new Date().toISOString(),
        image: (item as any).imageUrl,
    }));

    return (
        <main className="min-h-screen bg-surface">
            {/* Hero Section */}
            <section className="relative pt-32 pb-16 bg-accent overflow-hidden" data-hero-dark="true">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2" />

                <div className="container relative z-10 mx-auto px-4">
                    <div className="max-w-3xl">
                        <span className="inline-block px-4 py-1.5 bg-white/10 text-secondary text-sm font-bold tracking-widest uppercase rounded-full border border-white/10 mb-6 font-inter backdrop-blur-sm">
                            The School Pulse
                        </span>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                            Latest <span className="text-secondary italic">News & Stories</span>
                        </h1>
                        <p className="text-lg text-slate-300 leading-relaxed font-inter max-w-2xl">
                            Witness the vibrant life at MP Kids School. From academic milestones to creative triumphs, stay connected with our evolving legacy.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <NewsList initialNews={news} />
        </main>
    );
}
