"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, ArrowRight, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import * as gtag from "@/lib/gtag";

export function FloatingActions({ settings }: { settings?: any }) {
    const [showSticky, setShowSticky] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowSticky(window.scrollY > 500);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleCallClick = () => {
        gtag.event({
            action: 'call_click',
            category: 'engagement',
            label: 'Admissions Office'
        });
    };

    const handleWhatsAppClick = () => {
        gtag.event({
            action: 'whatsapp_click',
            category: 'engagement',
            label: 'Admissions Enquiry'
        });
    };

    const handleApplyClick = () => {
        gtag.event({
            action: 'cta_click',
            category: 'admission',
            label: 'Floating Sticky Apply'
        });
    };

    return (
        <>
            {/* WhatsApp Button */}
            <Link
                href={`https://wa.me/${settings?.whatsappNumber?.replace(/\D/g, '') || "919876543210"}?text=Hi, I would like to enquire about admissions at ${settings?.schoolName || "MP Public School"}.`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className={cn(
                    "fixed right-6 z-50 bg-[#25D366] text-white p-3 md:p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-300 group print:hidden",
                    showSticky ? "bottom-28 lg:bottom-6" : "bottom-6"
                )}
                aria-label="Contact on WhatsApp"
            >
                <MessageCircle className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-100">
                    Chat with us
                </span>
            </Link>

            {/* Call Now Button */}
            <a
                href={`tel:${settings?.contactPhone?.replace(/\D/g, '') || "+919876543210"}`}
                onClick={handleCallClick}
                className={cn(
                    "fixed z-50 bg-green-600 text-white p-3 md:p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-300 group print:hidden",
                    // Mobile: bottom-left. Desktop: right stack above WhatsApp
                    "left-6 bottom-6 lg:left-auto lg:right-6",
                    showSticky ? "bottom-28 lg:bottom-24" : "lg:bottom-24" // Stays above WhatsApp in desktop
                )}
                aria-label="Call Admissions Office"
            >
                <Phone className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                <span className="hidden lg:block absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-100">
                    Call Admissions Office
                </span>
            </a>

            {/* Sticky Apply CTA (Mobile Bottom / Desktop Slide-in) */}
            <AnimatePresence>
                {(showSticky && !isDismissed) && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-0 left-0 right-0 z-60 lg:bottom-10 lg:left-auto lg:right-32 lg:w-auto print:hidden"
                    >
                        <div className="relative bg-accent text-white px-6 py-4 lg:py-3 lg:px-8 shadow-2xl flex items-center justify-between gap-6 group border-t border-white/10 lg:rounded-2xl">
                            {/* Close Button */}
                            <button
                                onClick={() => setIsDismissed(true)}
                                className="absolute -top-3 -right-3 bg-red-600 text-white p-1.5 rounded-full shadow-lg hover:bg-red-700 transition-colors border-2 border-white"
                                aria-label="Dismiss banner"
                            >
                                <X className="w-3 h-3" />
                            </button>

                            <div className="hidden lg:block">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-white/70">Admissions 2026-27</p>
                                <p className="font-playfair font-bold text-lg">Limited Seats Remaining</p>
                            </div>
                            <Link
                                href="/admissions"
                                onClick={handleApplyClick}
                                className="w-full lg:w-auto bg-secondary text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-secondary-dark transition-all"
                            >
                                Apply Online Now <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
