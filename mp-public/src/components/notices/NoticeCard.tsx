"use client";

import React from 'react';
import { Calendar, Download, Tag, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export type NoticeCategory = 'Academic' | 'Exam' | 'Holiday' | 'Event' | 'Admission' | 'General';

export interface Notice {
    id: string;
    title: string;
    date: string;
    category: NoticeCategory;
    description: string;
    pdfUrl: string;
}

const CATEGORY_COLORS: Record<NoticeCategory, { bg: string; text: string; border: string }> = {
    Academic: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    Exam: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    Holiday: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    Event: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    Admission: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    General: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
};

interface NoticeCardProps {
    notice: Notice;
    index?: number;
}

export function NoticeCard({ notice, index = 0 }: NoticeCardProps) {
    const isNew = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    };

    const colors = CATEGORY_COLORS[notice.category] || CATEGORY_COLORS.General;
    const newlyPublished = isNew(notice.date);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/10 transition-all duration-500"
        >
            {newlyPublished && (
                <div className="absolute -top-3 -right-2 z-10">
                    <span className="flex items-center gap-1 bg-accent text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-accent/20 animate-bounce">
                        <Bell className="w-3 h-3" /> NEW
                    </span>
                </div>
            )}

            <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        colors.bg,
                        colors.text,
                        colors.border
                    )}>
                        <Tag className="w-3 h-3" /> {notice.category}
                    </span>
                    <div className="flex items-center gap-2 text-slate-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs font-semibold">{new Date(notice.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                </div>

                <h3 className="text-xl font-playfair font-bold text-primary mb-3 group-hover:text-accent transition-colors leading-tight">
                    {notice.title}
                </h3>

                <p className="text-sm text-slate-500 line-clamp-2 mb-6 grow">
                    {notice.description}
                </p>

                <div className="pt-4 border-t border-gray-50">
                    <a
                        href={notice.pdfUrl}
                        className="inline-flex items-center gap-2 text-xs font-bold text-primary group-hover:text-gold transition-colors uppercase tracking-widest"
                    >
                        <Download className="w-4 h-4" /> Download Circle
                    </a>
                </div>
            </div>
        </motion.div>
    );
}
