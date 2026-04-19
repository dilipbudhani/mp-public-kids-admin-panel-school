"use client";

import React from 'react';
import Link from 'next/link';
import { Calendar, ChevronRight, Clock, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils'; // Fixed import path

export type EventType = 'Exam' | 'Holiday' | 'Event' | 'PTM' | 'Result';

interface SchoolEvent {
    _id: string;
    title: string;
    date: string | Date;
    type: string;
}

const EVENT_TYPE_STYLES: Record<EventType, { bg: string; text: string; dot: string }> = {
    Exam: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
    Holiday: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    Event: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
    PTM: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
    Result: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
};

interface UpcomingEventsProps {
    events: SchoolEvent[];
}

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
    if (!events || events.length === 0) return null;

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container relative z-10 mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    {/* Left: Content */}
                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-secondary font-bold tracking-widest text-sm uppercase mb-4 inline-block">Mark the Dates</span>
                            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-6 leading-tight">
                                Upcoming <span className="text-gold italic">Campus Events</span>
                            </h2>
                            <p className="text-slate-500 mb-8 max-w-md font-inter leading-relaxed">
                                Don't miss out on important academic milestones and school celebrations. Sync your calendar with our latest schedules.
                            </p>

                            <Link
                                href="/academic-calendar"
                                className="group inline-flex items-center gap-4 px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/95 transition-all"
                            >
                                Full Academic Calendar
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right: Event List */}
                    <div className="lg:col-span-7 space-y-4">
                        {events.map((event, index) => {
                            const date = new Date(event.date);
                            const eventType = (event.type as any) as EventType;
                            const styles = EVENT_TYPE_STYLES[eventType] || EVENT_TYPE_STYLES.Event;

                            return (
                                <motion.div
                                    key={event._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative flex items-center gap-6 p-4 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-gold/30 hover:shadow-xl transition-all duration-500"
                                >
                                    <div className={cn("flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-sm border border-slate-100 shrink-0 group-hover:bg-primary group-hover:text-white transition-colors")}>
                                        <span className="text-sm font-bold uppercase tracking-widest text-slate-400 group-hover:text-gold transition-colors">
                                            {date.toLocaleString('default', { month: 'short' })}
                                        </span>
                                        <span className="text-3xl font-bold font-playfair leading-none mt-1 group-hover:text-white transition-colors">
                                            {date.getDate()}
                                        </span>
                                    </div>

                                    <div className="grow">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={cn("px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border", styles.bg, styles.text, "border-current/10")}>
                                                {event.type}
                                            </span>
                                            <div className="h-px grow bg-slate-100 group-hover:bg-gold/10 transition-colors"></div>
                                        </div>
                                        <h3 className="text-lg md:text-xl font-playfair font-bold text-primary group-hover:text-accent transition-colors leading-tight">
                                            {event.title}
                                        </h3>
                                    </div>

                                    <div className="hidden sm:flex flex-col items-end gap-1 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            <Clock className="w-3 h-3" /> 09:00 AM
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            <MapPin className="w-3 h-3" /> School Auditorium
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}

                        <div className="pt-4 flex items-center gap-3 text-slate-400">
                            <Sparkles className="w-4 h-4 text-gold animate-pulse" />
                            <p className="text-xs italic font-medium">All timings mention are local school time (IST).</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Decorative Element */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
        </section>
    );
}
