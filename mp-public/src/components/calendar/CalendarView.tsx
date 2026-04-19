"use client";

import React, { useState, useMemo } from 'react';
import { Calendar, Download, List, Grid, Info, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export type EventType = 'Exam' | 'Holiday' | 'Event' | 'PTM' | 'Result' | 'Academic';

interface SchoolEvent {
    _id: string;
    title: string;
    date: Date;
    type: EventType;
    description?: string;
    category?: string;
}

const EVENT_TYPE_COLORS: Record<string, { bg: string; text: string; dot: string; border: string }> = {
    Academic: { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-500', border: 'border-indigo-100' },
    Exam: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', border: 'border-red-100' },
    Holiday: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-100' },
    Event: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', border: 'border-amber-100' },
    PTM: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500', border: 'border-blue-100' },
    Result: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500', border: 'border-purple-100' },
};

interface CalendarViewProps {
    initialEvents: SchoolEvent[];
}

export default function CalendarView({ initialEvents }: CalendarViewProps) {
    const [viewMode, setViewMode] = useState<'list' | 'table'>('list');

    const months = useMemo(() => {
        if (initialEvents.length === 0) return [];

        // Find the range of dates in events
        const dates = initialEvents.map(e => new Date(e.date));
        const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
        const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

        // Start from April of minDate's year (academic year start)
        let start = new Date(minDate.getFullYear(), 3, 1);
        if (minDate.getMonth() < 3) {
            start.setFullYear(start.getFullYear() - 1);
        }

        // End at March of next year
        const end = new Date(start.getFullYear() + 1, 2, 31);

        const monthsRange = [];
        let current = new Date(start);
        while (current <= end) {
            monthsRange.push(new Date(current));
            current.setMonth(current.getMonth() + 1);
        }
        return monthsRange;
    }, [initialEvents]);

    const groupedEvents = useMemo(() => {
        const groups: Record<string, SchoolEvent[]> = {};
        initialEvents.forEach(event => {
            const date = new Date(event.date);
            const key = `${date.getFullYear()}-${date.getMonth()}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(event);
        });
        return groups;
    }, [initialEvents]);

    return (
        <section className="py-16 bg-surface">
            <div className="container mx-auto px-4">
                {/* Controls Overlay */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 -mt-24 relative z-20">
                    <div className="flex bg-white p-2 rounded-2xl shadow-xl border border-slate-100">
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
                                viewMode === 'list' ? "bg-primary text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
                            )}
                        >
                            <List className="w-4 h-4" /> List View
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
                                viewMode === 'table' ? "bg-primary text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
                            )}
                        >
                            <Grid className="w-4 h-4" /> Table View
                        </button>
                    </div>

                    <button className="flex items-center gap-3 px-8 py-4 bg-secondary text-primary font-bold rounded-2xl shadow-xl shadow-secondary/20 hover:scale-105 transition-transform group">
                        <Download className="w-5 h-5 group-hover:animate-bounce" />
                        Download Academic Calendar (PDF)
                    </button>
                </div>

                {/* Legend */}
                <div className="mb-12 flex flex-wrap gap-4 justify-center bg-white p-6 rounded-3xl shadow-sm border border-slate-50">
                    {Object.entries(EVENT_TYPE_COLORS).map(([type, colors]) => (
                        <div key={type} className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-50 bg-slate-50/50">
                            <div className={cn("w-2.5 h-2.5 rounded-full", colors.dot)}></div>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{type}</span>
                        </div>
                    ))}
                </div>

                {/* View Content */}
                <AnimatePresence mode="wait">
                    {viewMode === 'list' ? (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-12"
                        >
                            {months.map((monthDate, idx) => {
                                const key = `${monthDate.getFullYear()}-${monthDate.getMonth()}`;
                                const monthEvents = (groupedEvents[key] || []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                                return (
                                    <div key={key} className="relative">
                                        <div className="sticky top-24 z-10 bg-surface/80 backdrop-blur-sm py-4 mb-6 border-b border-secondary/20">
                                            <h2 className="text-3xl font-serif font-bold text-primary flex items-center gap-4">
                                                {monthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                                <span className="h-px grow bg-slate-100"></span>
                                                <span className="text-sm font-mono text-secondary/60">{String(idx + 1).padStart(2, '0')}</span>
                                            </h2>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {monthEvents.length > 0 ? (
                                                monthEvents.map((event) => {
                                                    const colors = EVENT_TYPE_COLORS[event.type] || EVENT_TYPE_COLORS.Event;
                                                    const date = new Date(event.date);
                                                    return (
                                                        <div key={event._id} className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                                                            <div className="flex justify-between items-start mb-4">
                                                                <div className={cn("text-2xl font-bold text-primary tabular-nums")}>
                                                                    {date.getDate()}
                                                                    <span className="text-xs ml-1 font-normal text-slate-400 uppercase tracking-tighter">
                                                                        {date.toLocaleString('default', { weekday: 'short' })}
                                                                    </span>
                                                                </div>
                                                                <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border", colors.bg, colors.text, colors.border)}>
                                                                    {event.type}
                                                                </span>
                                                            </div>
                                                            <h3 className="text-lg font-serif font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                                                                {event.title}
                                                            </h3>
                                                            {event.description && (
                                                                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{event.description}</p>
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                                                    <p className="text-slate-400 font-inter italic">No major events scheduled for this month.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="table"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden"
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-primary text-white">
                                            <th className="p-8 font-serif font-bold text-lg border-r border-white/10 uppercase tracking-widest w-64">Month</th>
                                            <th className="p-8 font-serif font-bold text-lg uppercase tracking-widest">Events & Activities</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {months.map((monthDate) => {
                                            const key = `${monthDate.getFullYear()}-${monthDate.getMonth()}`;
                                            const monthEvents = (groupedEvents[key] || []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                                            return (
                                                <tr key={key} className="group">
                                                    <td className="p-8 font-bold text-primary align-top border-r border-slate-50 bg-slate-50/30">
                                                        <div className="sticky top-32">
                                                            <div className="text-2xl font-serif">{monthDate.toLocaleString('default', { month: 'long' })}</div>
                                                            <div className="text-secondary text-sm font-mono mt-1">{monthDate.getFullYear()}</div>
                                                        </div>
                                                    </td>
                                                    <td className="p-8">
                                                        <div className="flex flex-col gap-4">
                                                            {monthEvents.length > 0 ? (
                                                                monthEvents.map(event => {
                                                                    const colors = EVENT_TYPE_COLORS[event.type] || EVENT_TYPE_COLORS.Event;
                                                                    const date = new Date(event.date);
                                                                    return (
                                                                        <div key={event._id} className="flex gap-6 items-start p-4 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all">
                                                                            <div className={cn("min-w-[64px] py-1.5 px-3 text-center rounded-xl", colors.bg, colors.text)}>
                                                                                <div className="text-xl font-bold">{date.getDate()}</div>
                                                                                <div className="text-[10px] uppercase font-black tracking-tighter">{date.toLocaleString('default', { weekday: 'short' })}</div>
                                                                            </div>
                                                                            <div className="grow pt-1">
                                                                                <h4 className="font-bold text-primary group-hover:text-accent transition-colors">{event.title}</h4>
                                                                                {event.description && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{event.description}</p>}
                                                                            </div>
                                                                            <span className={cn("text-[9px] font-black uppercase tracking-[0.2em] pt-2", colors.text)}>
                                                                                {event.type}
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                })
                                                            ) : (
                                                                <div className="py-8 text-center text-slate-300 italic text-sm">Regular academic schedule</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Clarification CTA */}
                <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-8 bg-primary p-10 rounded-4xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-700" />
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-secondary backdrop-blur-sm">
                            <Info className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">Need Clarification?</h3>
                            <p className="text-slate-300 max-w-md">Our academic team is here to help with any schedule-related queries or changes.</p>
                        </div>
                    </div>
                    <Link href="/contact" className="btn bg-secondary text-primary px-10 py-4 rounded-xl font-bold text-sm tracking-widest relative z-10 hover:bg-white transition-all">
                        Reach Out Now
                    </Link>
                </div>
            </div>
        </section>
    );
}
