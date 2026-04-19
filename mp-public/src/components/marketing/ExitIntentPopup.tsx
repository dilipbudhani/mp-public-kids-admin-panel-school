"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Send, Info } from "lucide-react";
import { toast } from "sonner";
import * as gtag from "@/lib/gtag";

const EXCLUDED_PATHS = [
    "/admissions/apply",
    "/admin",
    "/privacy-policy",
    "/terms",
    "/disclaimer",
];

export function ExitIntentPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Don't show if already shown in this session or on excluded paths
        const isShown = sessionStorage.getItem("exit_popup_shown");
        const isExcluded = EXCLUDED_PATHS.some((path) => pathname.startsWith(path));

        if (isShown || isExcluded) return;

        let timeoutId: NodeJS.Timeout;

        const showPopup = () => {
            timeoutId = setTimeout(() => {
                setIsVisible(true);
                sessionStorage.setItem("exit_popup_shown", "true");
            }, 2000);
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (e.clientY < 20) {
                showPopup();
                document.removeEventListener("mouseleave", handleMouseLeave);
                document.removeEventListener("mousemove", handleMouseMove);
            }
        };

        const handleMouseLeave = () => {
            showPopup();
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mousemove", handleMouseMove);
        };

        // Desktop: Exit intent
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseleave", handleMouseLeave);

        // Mobile: 30s fallback or scroll depth
        const handleScroll = () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            if (scrollPercent > 35) {
                showPopup();
                window.removeEventListener("scroll", handleScroll);
            }
        };

        if (typeof window !== "undefined" && window.innerWidth < 1024) {
            window.addEventListener("scroll", handleScroll);
        }

        const mobileTimer = setTimeout(() => {
            showPopup();
        }, 30000);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("scroll", handleScroll);
            clearTimeout(mobileTimer);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [pathname]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsVisible(false);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("childName"),
            phone: formData.get("parentPhone"),
            enquiryType: "admission",
            source: "popup",
            message: `Popup lead - Class: ${formData.get("class")}`,
        };

        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setIsSubmitted(true);
                gtag.event({
                    action: 'form_submit',
                    category: 'lead',
                    label: 'Exit Intent Popup'
                });
            } else {
                toast.error("Failed to submit. Please try again.");
            }
        } catch (err) {
            toast.error("An error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => setIsVisible(false);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-primary/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl"
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>

                        <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-1/2 h-40 md:h-auto relative bg-slate-100">
                                <Image
                                    src="/images/cta/admission-popup.jpg"
                                    alt="MP Public School Students"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                <div className="absolute inset-0 bg-linear-to-t md:bg-linear-to-r from-primary/20 to-transparent" />
                            </div>

                            {/* Content Section */}
                            <div className="w-full md:w-1/2 p-6 md:p-8">
                                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-4">
                                    Admissions Open 2026-27
                                </div>

                                {isSubmitted ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-4"
                                    >
                                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold text-primary mb-2">Thank You!</h3>
                                        <p className="text-slate-600 text-sm">Our team will call you within 2 hours.</p>
                                        <button
                                            onClick={handleClose}
                                            className="mt-6 text-xs font-bold uppercase tracking-widest text-[#D4AF37] hover:underline"
                                        >
                                            Close Window
                                        </button>
                                    </motion.div>
                                ) : (
                                    <>
                                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                                            Ready for <span className="text-primary font-serif italic">Greatness?</span>
                                        </h2>
                                        <p className="text-gray-600 mb-6 text-sm">
                                            Join MP Public School. Limited seats available for the upcoming session.
                                        </p>

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Child's Name</label>
                                                <input
                                                    name="childName"
                                                    required
                                                    placeholder="Enter student name"
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-inter"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Parent's Phone</label>
                                                <input
                                                    name="parentPhone"
                                                    type="tel"
                                                    inputMode="tel"
                                                    pattern="[0-9]{10}"
                                                    maxLength={10}
                                                    required
                                                    placeholder="10-digit mobile number"
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-inter"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Interested For Class</label>
                                                <select
                                                    name="class"
                                                    required
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer font-inter"
                                                >
                                                    <option value="">Select Class</option>
                                                    <option value="Nursery">Nursery</option>
                                                    <option value="Class 1-5">Class 1-5</option>
                                                    <option value="Class 6-8">Class 6-8</option>
                                                    <option value="Class 9-10">Class 9-10</option>
                                                    <option value="Class 11-12">Class 11-12</option>
                                                </select>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full bg-primary text-white py-3.5 flex items-center justify-center gap-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 shadow-primary/20"
                                            >
                                                {isSubmitting ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        Enquire Now <Send className="w-4 h-4 ml-1" />
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
