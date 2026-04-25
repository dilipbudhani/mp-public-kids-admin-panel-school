"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { NoticeCard, Notice } from './notices/NoticeCard';

interface NoticeWidgetProps {
    notices: Notice[];
}

export default function NoticeWidget({ notices }: NoticeWidgetProps) {
    if (!notices || notices.length === 0) return null;

    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-xl">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                            <Bell className="w-3 h-3" /> Notifications
                        </span>
                        <h2 className="text-3xl md:text-5xl font-playfair font-bold text-primary leading-tight">
                            Latest from <span className="text-gold italic">Notice Board</span>
                        </h2>
                    </div>

                    <Link
                        href="/notices"
                        className="group inline-flex items-center gap-3 text-primary font-bold uppercase tracking-widest text-sm hover:text-accent transition-colors"
                    >
                        View All Circulars
                        <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {notices.map((notice, index) => (
                        <NoticeCard key={(notice as any)._id || notice.id || index} notice={notice} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
