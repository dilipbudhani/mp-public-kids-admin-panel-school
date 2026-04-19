"use client";

import React, { useState, useEffect } from "react";
import { X, Bell, ExternalLink, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Notice {
    _id: string;
    title: string;
    summary: string;
    slug: string;
    date: string;
    category: string;
}

export default function NoticePopup() {
    const [notice, setNotice] = useState<Notice | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPopupNotice = async () => {
            try {
                const res = await fetch("/api/news/popup");
                if (res.ok) {
                    const data = await res.json();
                    if (data) {
                        // Check if the user has already dismissed this specific notice
                        const dismissedNoticeId = localStorage.getItem("dismissedNoticeId");
                        if (dismissedNoticeId !== data._id) {
                            setNotice(data);
                            // Delay slightly for better UX
                            setTimeout(() => setIsOpen(true), 1500);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching popup notice:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPopupNotice();
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        if (notice) {
            localStorage.setItem("dismissedNoticeId", notice._id);
        }
    };

    if (!notice) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
                    />

                    {/* Popup Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none z-[9999]"
                    >
                        <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl pointer-events-auto overflow-hidden border border-white/20">
                            {/* Decorative Header */}
                            <div className="relative h-32 bg-primary overflow-hidden">
                                <div className="absolute inset-0 bg-linear-to-br from-primary via-primary/80 to-primary/40" />
                                <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-black/10 rounded-full blur-xl" />

                                <div className="relative h-full flex items-center px-8">
                                    <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 mr-4">
                                        <Bell className="w-6 h-6 text-white animate-bounce" />
                                    </div>
                                    <div>
                                        <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">Latest Announcement</span>
                                        <h2 className="text-xl font-black text-white leading-tight">Important Notice</h2>
                                    </div>
                                </div>

                                <button
                                    onClick={handleClose}
                                    className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all group"
                                >
                                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-8 pt-6 space-y-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/10">
                                            {notice.category}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {new Date(notice.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 leading-tight">
                                        {notice.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed font-medium">
                                        {notice.summary}
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                    <Link
                                        href={`/news/${notice.slug}`}
                                        onClick={handleClose}
                                        className="flex-1 bg-primary text-white px-8 py-4 rounded-2xl hover:bg-primary/90 transition-all font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 group"
                                    >
                                        Read Full Details
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <button
                                        onClick={handleClose}
                                        className="flex-1 bg-slate-50 text-slate-500 px-8 py-4 rounded-2xl hover:bg-slate-100 transition-all font-black uppercase tracking-widest text-xs border border-slate-100"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>

                            {/* Footer hint */}
                            <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-50 flex justify-center italic">
                                <p className="text-[10px] text-slate-400 font-medium">
                                    Stay updated with MP Kids School's latest news and events.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
