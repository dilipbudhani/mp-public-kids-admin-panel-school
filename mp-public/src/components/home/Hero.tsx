"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Award, Users, BookOpen, Star } from "lucide-react";
import { cn } from "@/lib/utils";

import { SiteSettings } from "@/types/shared";

interface Slide {
    _id: string;
    imageUrl: string;
    badge: string;
    title: string;
    highlight: string;
    description: string;
    cta1Text?: string;
    cta1Href?: string;
    cta2Text?: string;
    cta2Href?: string;
    statValue?: string;
    statLabel?: string;
}

export function Hero({ slides, settings }: { slides: Slide[], settings: SiteSettings | null }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(handleNext, 6000);
        return () => clearInterval(timer);
    }, [handleNext, slides.length]);

    if (!slides || slides.length === 0) return null;

    return (
        <section data-hero-dark="true" className="relative h-auto lg:h-[90vh] min-h-[600px] flex flex-col lg:flex-row lg:items-center overflow-x-hidden overflow-y-clip lg:overflow-hidden bg-primary pt-20 lg:pt-0">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 1.2 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={slides[currentIndex].imageUrl}
                            alt={slides[currentIndex].title}
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-r from-primary/95 via-primary/70 to-transparent lg:from-primary/90 lg:via-primary/50" />
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="container relative z-10 flex flex-col justify-center h-full pt-16 pb-44 lg:pb-0 lg:py-0">
                <div className="max-w-4xl lg:pl-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 30 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="space-y-6 lg:space-y-8"
                        >


                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight text-white font-playfair">
                                {slides[currentIndex].title} <br />
                                <span className="text-secondary inline-block mt-2">
                                    {slides[currentIndex].highlight}
                                </span>
                            </h1>

                            <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed lg:pr-12">
                                {slides[currentIndex].description}
                            </p>

                            {(slides[currentIndex].cta1Text || slides[currentIndex].cta2Text) && (
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    {slides[currentIndex].cta1Text && (
                                        <Link
                                            href={slides[currentIndex].cta1Href || "#"}
                                            className="px-8 py-4 bg-secondary hover:bg-secondary-dark text-primary rounded-xl font-bold transition-all transform hover:scale-105 shadow-xl shadow-secondary/20 flex items-center justify-center gap-2 group"
                                        >
                                            {slides[currentIndex].cta1Text}
                                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    )}
                                    {slides[currentIndex].cta2Text && (
                                        <Link
                                            href={slides[currentIndex].cta2Href || "#"}
                                            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold backdrop-blur-md border border-white/20 transition-all flex items-center justify-center"
                                        >
                                            {slides[currentIndex].cta2Text}
                                        </Link>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Navigation Controls - Arrows on Sides, Indicators at Bottom */}
            <div className="absolute inset-x-0 top-1/2 lg:top-1/2 -translate-y-1/2 z-30 flex justify-between px-4 lg:px-12 pointer-events-none">
                <button
                    onClick={handlePrev}
                    className="p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all active:scale-95 group pointer-events-auto hidden sm:flex"
                >
                    <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 group-hover:-translate-x-1 transition-transform" />
                </button>
                <button
                    onClick={handleNext}
                    className="p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all active:scale-95 group pointer-events-auto hidden sm:flex"
                >
                    <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Mobile Arrows - More accessible positioning at the bottom */}
            <div className="absolute bottom-32 left-0 right-0 z-30 flex justify-between px-6 sm:hidden pointer-events-none">
                <button
                    onClick={handlePrev}
                    className="p-3 rounded-xl bg-white/10 text-white backdrop-blur-md border border-white/20 pointer-events-auto active:scale-90"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                    onClick={handleNext}
                    className="p-3 rounded-xl bg-white/10 text-white backdrop-blur-md border border-white/20 pointer-events-auto active:scale-90"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Indicators - Centered above the bottom bar */}
            <div className="absolute bottom-28 lg:bottom-24 left-1/2 -translate-x-1/2 z-20">
                <div className="flex gap-3 lg:gap-4">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={cn(
                                "h-1.5 rounded-full transition-all duration-300",
                                currentIndex === index ? "w-10 bg-secondary" : "w-4 bg-white/30 hover:bg-white/50"
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* Trust Items - Bottom Bar */}
            <div className="w-full mt-auto lg:absolute lg:bottom-0 lg:left-0 lg:right-0 bg-white/10 backdrop-blur-md border-t border-white/10 z-20">
                <div className="container py-6 lg:py-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        <TrustItem
                            icon={<Award className="text-gold w-5 h-5 lg:w-6 lg:h-6 shrink-0" />}
                            text={settings?.trustItem1Text || "CBSE Affiliated"}
                            sub={settings?.trustItem1Sub || `Affiliation No: ${settings?.affiliationNo || "1234567"}`}
                        />
                        <TrustItem
                            icon={<Users className="text-gold w-5 h-5 lg:w-6 lg:h-6 shrink-0" />}
                            text={settings?.trustItem2Text || "Expert Faculty"}
                            sub={settings?.trustItem2Sub || "100+ Certified Teachers"}
                        />
                        <TrustItem
                            icon={<Star className="text-gold w-5 h-5 lg:w-6 lg:h-6 shrink-0" />}
                            text={settings?.trustItem3Text || "Academic Excellence"}
                            sub={settings?.trustItem3Sub || "Established 1995"}
                        />
                        <TrustItem
                            icon={<BookOpen className="text-gold w-5 h-5 lg:w-6 lg:h-6 shrink-0" />}
                            text={settings?.trustItem4Text || "Holistic Growth"}
                            sub={settings?.trustItem4Sub || "Focus on Academic & Personal"}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

function TrustItem({ icon, text, sub }: { icon: React.ReactNode; text: string; sub: string }) {
    return (
        <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-white/5 border border-white/20 flex items-center justify-center shrink-0 group-hover:bg-gold/20 group-hover:border-gold transition-all">
                {icon}
            </div>
            <div>
                <p className="text-white font-bold text-sm tracking-wide uppercase">{text}</p>
                <p className="text-white/60 text-[10px] tracking-widest font-medium mt-0.5">{sub}</p>
            </div>
        </div>
    );
}
