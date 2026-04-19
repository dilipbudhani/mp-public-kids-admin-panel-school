"use client";

import React, { useState, useMemo } from 'react';
import { Search, Info, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { NoticeCard } from '@/components/notices/NoticeCard';

const CATEGORIES = ['All', 'Academic', 'Exam', 'Holiday', 'Event', 'Admission', 'General'] as const;
type Category = typeof CATEGORIES[number];

interface NoticeListProps {
    initialNotices: any[];
}

export default function NoticeList({ initialNotices }: NoticeListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<Category>('All');
    const [visibleCount, setVisibleCount] = useState(10);

    const filteredNotices = useMemo(() => {
        return initialNotices
            .filter(notice => {
                const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    notice.description.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCategory = activeCategory === 'All' || notice.category === activeCategory;
                return matchesSearch && matchesCategory;
            });
    }, [searchQuery, activeCategory, initialNotices]);

    const displayedNotices = filteredNotices.slice(0, visibleCount);
    const hasMore = filteredNotices.length > visibleCount;

    return (
        <section className="py-12 bg-surface">
            <div className="container">
                {/* Filters & Search */}
                <div className="bg-white rounded-4xl p-5 md:p-8 shadow-2xl shadow-slate-200/60 -mt-20 relative z-20 border border-slate-100/50 backdrop-blur-sm">
                    <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
                        {/* Search Box */}
                        <div className="relative w-full lg:max-w-md group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search notices by title or content..."
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

                        {/* Filters */}
                        <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={cn(
                                        "px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 border flex items-center gap-2",
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

                {/* Notices Grid */}
                <div className="mt-12">
                    {displayedNotices.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence mode="popLayout">
                                {displayedNotices.map((notice, index) => (
                                    <NoticeCard
                                        key={notice._id || notice.id}
                                        notice={{
                                            id: notice._id || notice.id,
                                            title: notice.title,
                                            date: notice.date,
                                            category: notice.category,
                                            description: notice.description,
                                            pdfUrl: notice.pdfUrl || '#'
                                        }}
                                        index={index}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-24 text-center"
                        >
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                                <Info className="w-10 h-10 text-slate-400" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-primary mb-2">No Notices Found</h3>
                            <p className="text-slate-500 max-w-sm mx-auto">
                                We couldn't find any notices matching your current search or category filter.
                            </p>
                            <button
                                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                                className="mt-6 text-accent font-bold uppercase tracking-widest text-sm hover:underline"
                            >
                                Clear all filters
                            </button>
                        </motion.div>
                    )}

                    {/* Pagination */}
                    {hasMore && (
                        <div className="mt-16 flex justify-center">
                            <button
                                onClick={() => setVisibleCount(prev => prev + 6)}
                                className="group flex items-center gap-3 px-8 py-4 bg-white border-2 border-primary text-primary font-bold uppercase tracking-[0.2em] text-sm hover:bg-primary hover:text-white transition-all duration-500 rounded-2xl shadow-xl shadow-slate-200/50"
                            >
                                Load More Notices
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}

                    <div className="mt-16 text-center">
                        <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
                            <Info className="w-4 h-4" />
                            All dates mentioned are in Indian Standard Time (IST)
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
