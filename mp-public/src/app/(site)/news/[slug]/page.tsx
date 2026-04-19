import React from 'react';
import { dbConnect } from '@/lib/mongodb';
import News from '@/models/News';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowLeft, Share2, Facebook, Linkedin } from 'lucide-react';
import { XIcon } from "@/components/ui/Icons";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    await dbConnect();
    const news = await News.findOne({ slug, schoolIds: process.env.SCHOOL_ID }).lean();
    if (!news) return { title: 'News Not Found' };

    return {
        title: `${news.title} | MP Public School News`,
        description: news.summary,
    };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    await dbConnect();

    const news = await News.findOne({ slug, schoolIds: process.env.SCHOOL_ID }).lean();
    const recentNews = await News.find({
        _id: { $ne: news?._id },
        schoolIds: process.env.SCHOOL_ID,
        status: 'published'
    })
        .sort({ date: -1 })
        .limit(3)
        .lean();

    if (!news) notFound();

    const item = {
        ...news,
        publishedAt: (news as any).date instanceof Date ? (news as any).date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }) : 'Recent',
        image: (news as any).imageUrl,
    };

    return (
        <main className="min-h-screen bg-white">
            {/* Post Header Hero */}
            <section className="relative pt-32 pb-16 bg-primary overflow-hidden" data-hero-dark="true">
                <div className="container relative z-10 mx-auto px-4">
                    <Link
                        href="/news"
                        className="inline-flex items-center gap-2 text-secondary font-bold text-sm uppercase tracking-widest mb-8 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to all news
                    </Link>

                    <div className="max-w-4xl">
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <span className="px-3 py-1 bg-secondary text-primary font-bold text-[10px] uppercase tracking-widest rounded-lg">
                                {item.category}
                            </span>
                            <span className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                                <Calendar className="w-4 h-4 text-secondary" /> {item.publishedAt}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                            {item.title}
                        </h1>

                        <p className="text-xl text-slate-300 leading-relaxed font-inter italic max-w-3xl">
                            {item.summary}
                        </p>
                    </div>
                </div>
            </section>

            {/* Post Content Area */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Main Content */}
                        <div className="lg:col-span-8">
                            {item.image && (
                                <div className="relative h-[400px] md:h-[500px] rounded-4xl overflow-hidden mb-12 shadow-2xl">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}

                            <div className="prose prose-lg prose-slate max-w-none 
                                prose-headings:font-serif prose-headings:text-primary prose-headings:font-bold
                                prose-p:text-slate-600 prose-p:leading-relaxed
                                prose-a:text-secondary prose-a:font-bold hover:prose-a:text-accent
                                prose-img:rounded-3xl prose-strong:text-primary
                            ">
                                <div dangerouslySetInnerHTML={{ __html: item.content }} />
                            </div>

                            {/* Share & Tags */}
                            <div className="mt-16 pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-bold text-primary uppercase tracking-widest">Share this story</span>
                                    <div className="flex gap-2">
                                        {[Facebook, XIcon, Linkedin].map((Icon, i) => (
                                            <button key={i} className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                                                <Icon size={16} />
                                            </button>
                                        ))}
                                        <button className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-secondary hover:text-primary hover:border-secondary transition-all duration-300">
                                            <Share2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent News Aside */}
                        <aside className="lg:col-span-4 space-y-12">
                            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                                <h3 className="text-2xl font-serif font-bold text-primary mb-8 border-b border-primary/10 pb-4">
                                    Recent <span className="text-accent italic">Stories</span>
                                </h3>

                                <div className="space-y-8">
                                    {recentNews.map((recent: any) => (
                                        <Link key={recent._id} href={`/news/${recent.slug}`} className="group block">
                                            <div className="flex gap-4">
                                                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                                                    {recent.imageUrl ? (
                                                        <Image
                                                            src={recent.imageUrl}
                                                            alt={recent.title}
                                                            fill
                                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 bg-primary/10" />
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-1">
                                                        {recent.category}
                                                    </span>
                                                    <h4 className="text-sm font-bold text-primary group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                                                        {recent.title}
                                                    </h4>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                <Link
                                    href="/news"
                                    className="mt-8 pt-6 border-t border-slate-200 text-center block text-sm font-bold text-primary hover:text-secondary transition-colors uppercase tracking-widest"
                                >
                                    Explore all news
                                </Link>
                            </div>

                            {/* CTAs or Info */}
                            <div className="bg-primary rounded-3xl p-8 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
                                <h4 className="text-xl font-bold mb-4 relative z-10">Stay Informed</h4>
                                <p className="text-slate-300 text-sm mb-6 relative z-10">Subscribe to our newsletter to receive the latest updates directly in your inbox.</p>
                                <div className="relative z-10">
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 outline-none focus:bg-white/20 transition-all text-sm mb-4"
                                    />
                                    <button className="w-full bg-secondary text-primary font-bold py-3 rounded-xl hover:bg-white transition-all duration-300 text-sm">
                                        Subscribe Now
                                    </button>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </main>
    );
}
