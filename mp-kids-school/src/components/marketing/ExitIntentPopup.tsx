"use client";

import React, { useState, useEffect } from "react";
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

        // Mobile: 45s fallback
        const mobileTimer = setTimeout(() => {
            showPopup();
        }, 45000);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseleave", handleMouseLeave);
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

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsVisible(false)}
                        className="absolute inset-0 bg-primary/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
                    >
                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-primary transition-colors z-10"
                        >
                            <X size={24} />
                        </button>

                        <div className="pt-10 pb-8 px-8 text-center bg-slate-50 border-b border-slate-100">
                            <div className="w-16 h-16 bg-primary text-gold rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                                <Info size={32} />
                            </div>
                            <h2 className="text-3xl font-playfair font-bold text-primary mb-2">Wait! Before You Go...</h2>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Get complete information about admissions, fees, and facilities — directly in your inbox.
                            </p>
                        </div>

                        <div className="p-8">
                            {isSubmitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-8"
                                >
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-primary mb-3">Thank You!</h3>
                                    <p className="text-slate-600">Our team will call you within 2 hours.</p>
                                    <button
                                        onClick={() => setIsVisible(false)}
                                        className="mt-8 text-sm font-bold uppercase tracking-widest text-[#D4AF37] hover:underline"
                                    >
                                        Close Window
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Child's Name</label>
                                        <input
                                            name="childName"
                                            required
                                            placeholder="Enter student name"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-inter"
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
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-inter"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Interested For Class</label>
                                        <select
                                            name="class"
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer font-inter"
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
                                        className="w-full bg-primary text-white py-4 flex items-center justify-center gap-3 rounded-xl font-bold transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] mt-4"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Get Free Information Pack <Send className="w-4 h-4 ml-1" />
                                            </>
                                        )}
                                    </button>
                                    <p className="text-[10px] text-center text-slate-400 leading-relaxed font-inter">
                                        No spam. We respect your privacy.
                                    </p>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
