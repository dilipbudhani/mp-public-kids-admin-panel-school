'use client';

import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface NewsItem {
    _id: string;
    title: string;
    slug: string;
    summary: string;
    category: string;
    image?: string;
    isFeatured: boolean;
    publishedAt: string | Date;
}

interface HomeNewsProps {
    news: NewsItem[];
}

export default function HomeNews({ news }: HomeNewsProps) {
    if (!news || news.length === 0) return null;

    // Separate featured and regular news
    const featuredNews = news.find(n => n.isFeatured) || news[0];
    const otherNews = news.filter(n => n._id !== featuredNews._id).slice(0, 3);

    return (
        <section className="py-24 bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-center md:text-left">
                    <div className="flex-1">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-primary font-bold tracking-widest text-sm uppercase mb-4 inline-block"
                        >
                            School Pulse
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-serif text-accent font-bold mb-4"
                        >
                            News & Recent Updates
                        </motion.h2>
                        <div className="w-24 h-1 bg-secondary rounded-full mx-auto md:mx-0" />
                    </div>
                    <Link href="/news" className="btn-secondary hidden md:inline-flex">
                        View All Updates
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Featured News Card */}
                    {featuredNews && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="group relative h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-accent"
                        >
                            {featuredNews.image ? (
                                <Image
                                    src={featuredNews.image}
                                    alt={featuredNews.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-primary/20" />
                            )}
                            <div className="absolute inset-0 bg-linear-to-t from-accent via-accent/20 to-transparent z-10" />
                            <div className="absolute inset-x-0 bottom-0 p-10 z-20">
                                <span className="px-4 py-1 bg-secondary text-accent font-bold text-xs uppercase rounded-full mb-6 inline-block">
                                    {featuredNews.category || 'Latest Development'}
                                </span>
                                <h3 className="text-3xl md:text-4xl font-serif text-white font-bold mb-4 leading-tight">
                                    {featuredNews.title}
                                </h3>
                                <p className="text-white/80 line-clamp-2 mb-6 max-w-lg">
                                    {featuredNews.summary}
                                </p>
                                <Link href={`/news/${featuredNews.slug}`} className="text-white font-bold inline-flex items-center gap-2 group/btn">
                                    Read Full Story
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-secondary group-hover/btn:text-accent transition-all">
                                        <ArrowRight size={18} />
                                    </div>
                                </Link>
                            </div>
                        </motion.div>
                    )}

                    {/* News List */}
                    <div className="space-y-6">
                        {otherNews.map((item, index) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-l-secondary hover:shadow-xl transition-all group"
                            >
                                <div className="flex items-center gap-4 text-slate-500 text-sm mb-4">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={14} className="text-primary" />
                                        {new Date(item.publishedAt).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                    <span className="text-primary font-bold uppercase tracking-widest text-[10px]">
                                        {item.category}
                                    </span>
                                </div>
                                <h4 className="text-xl font-serif text-accent font-bold mb-3 group-hover:text-primary transition-colors">
                                    {item.title}
                                </h4>
                                <p className="text-slate-600 line-clamp-2 mb-4">
                                    {item.summary}
                                </p>
                                <Link href={`/news/${item.slug}`} className="text-accent font-bold text-sm inline-flex items-center gap-1 border-b-2 border-transparent hover:border-secondary transition-all">
                                    Continue Reading
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
