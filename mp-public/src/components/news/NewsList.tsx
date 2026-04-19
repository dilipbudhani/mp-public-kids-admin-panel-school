"use client";

import React, { useState, useMemo } from 'react';
import { Search, Calendar, ArrowRight, Tag, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

interface NewsItem {
    _id: string;
    title: string;
    slug: string;
    summary: string;
    category: string;
    image?: string;
    isFeatured: boolean;
    publishedAt: string;
}

interface NewsListProps {
    initialNews: NewsItem[];
}

const CATEGORIES = ['All', 'Academic', 'Event', 'Achievement', 'Campus', 'Sports'] as const;

export default function NewsList({ initialNews }: NewsListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const [visibleCount, setVisibleCount] = useState(6);

    const filteredNews = useMemo(() => {
        return initialNews.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.summary.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeCategory, initialNews]);

    const displayedNews = filteredNews.slice(0, visibleCount);
    const hasMore = filteredNews.length > visibleCount;

    return (
        <section className="py-12 bg-surface">
            <div className="container mx-auto px-4">
                {/* Search & Filters */}
                <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-200/50 -mt-20 relative z-20 border border-slate-100 mb-16">
                    <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
                        <div className="relative w-full lg:max-w-md group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search news stories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-10 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-primary font-medium"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-accent transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 border",
                                        activeCategory === cat
                                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                            : "bg-white text-slate-500 border-slate-100 hover:border-primary/30 hover:text-primary hover:bg-slate-50"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {displayedNews.map((item, index) => (
                            <motion.article
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                            <Tag className="w-12 h-12 text-primary/20" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary font-bold text-[10px] uppercase tracking-widest rounded-lg shadow-sm">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-4 font-bold">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-secondary" />
                                            {new Date(item.publishedAt).toLocaleDateString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-serif font-bold text-primary mb-4 group-hover:text-accent transition-colors line-clamp-2 leading-tight">
                                        {item.title}
                                    </h3>

                                    <p className="text-slate-500 text-sm line-clamp-3 mb-6 leading-relaxed">
                                        {item.summary}
                                    </p>

                                    <Link
                                        href={`/news/${item.slug}`}
                                        className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:text-secondary transition-colors uppercase tracking-[0.15em]"
                                    >
                                        Read More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.article>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Empty State */}
                {displayedNews.length === 0 && (
                    <div className="text-center py-24">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-primary mb-2">No Stories Found</h3>
                        <p className="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
                    </div>
                )}

                {/* Load More */}
                {hasMore && (
                    <div className="mt-16 flex justify-center">
                        <button
                            onClick={() => setVisibleCount(prev => prev + 6)}
                            className="px-10 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-secondary hover:text-primary transition-all duration-300 uppercase tracking-widest text-sm"
                        >
                            Explore More Stories
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
