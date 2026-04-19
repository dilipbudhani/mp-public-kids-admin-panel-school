"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronDown,
    Trophy,
    Rocket,
    ExternalLink,
    ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Counter from "@/components/ui/Counter";

interface SuccessStoryData {
    _id: string;
    name: string;
    batch: string;
    category: string;
    headline: string;
    summary: string;
    story: string;
    image?: string;
    isActive: boolean;
}

interface SuccessStoriesClientProps {
    initialStories: SuccessStoryData[];
    pageData?: any;
}

const CATEGORIES = ["All", "IIT/NIT", "Medical", "Civil Services", "Sports", "Arts", "Entrepreneurship", "Defence"];

const STATS = [
    { label: "IIT/NIT Selections", value: 50, suffix: "+" },
    { label: "Medical Seats", value: 30, suffix: "+" },
    { label: "IAS/IPS Officers", value: 8, suffix: "" },
    { label: "National Athletes", value: 15, suffix: "" },
    { label: "Entrepreneurs", value: 200, suffix: "+" }
];

function StoryCard({ story }: { story: SuccessStoryData }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const initials = story.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    // Determine a color based on the category or random
    const colors = [
        "bg-blue-100 text-blue-600",
        "bg-red-100 text-red-600",
        "bg-emerald-100 text-emerald-600",
        "bg-orange-100 text-orange-600",
        "bg-amber-100 text-amber-600",
        "bg-indigo-100 text-indigo-600",
        "bg-pink-100 text-pink-600"
    ];
    const colorIndex = story.category.length % colors.length;
    const colorClass = colors[colorIndex];

    return (
        <motion.div
            layout
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden h-fit"
        >
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg", colorClass)}>
                        {initials}
                    </div>
                    <div>
                        <h4 className="font-bold text-primary">{story.name}</h4>
                        <p className="text-xs text-text/40 font-medium">Batch {story.batch}</p>
                    </div>
                </div>
                <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    colorClass
                )}>
                    {story.category}
                </span>
            </div>

            <h3 className="text-lg font-bold text-primary mb-3 leading-snug">
                {story.headline}
            </h3>

            <p className="text-text/60 text-sm mb-6 leading-relaxed">
                {story.summary}
            </p>

            <motion.div
                animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                className="overflow-hidden"
            >
                <div className="pt-4 border-t border-gray-100 mb-6">
                    <div className="prose prose-sm text-text/70 leading-relaxed whitespace-pre-line">
                        {story.story}
                    </div>
                </div>
            </motion.div>

            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-surface text-accent font-bold text-sm hover:bg-accent hover:text-white transition-all group"
            >
                {isExpanded ? (
                    <>Show Less <ChevronUp className="w-4 h-4" /></>
                ) : (
                    <>Read Full Story <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" /></>
                )}
            </button>
        </motion.div>
    );
}

export default function SuccessStoriesClient({ initialStories, pageData }: SuccessStoriesClientProps) {
    const [activeTab, setActiveTab] = useState("All");

    const filteredStories = initialStories.filter(s => activeTab === "All" || s.category === activeTab);
    const featuredStory = initialStories[0];

    const heroData = {
        title: pageData?.title || "Stories of Excellence",
        subtitle: pageData?.subtitle || "Legacy of Success",
        description: pageData?.description || "From our classrooms to the world stage. Celebrate the journeys of students who dared to dream.",
        bannerImage: pageData?.bannerImage || null
    };

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section
                data-hero-dark="true"
                className="relative py-24 lg:py-32 bg-primary overflow-hidden"
            >
                <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent opacity-50" />
                </div>
                {heroData.bannerImage && (
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={heroData.bannerImage}
                            alt={heroData.title}
                            fill
                            className="object-cover opacity-30"
                            priority
                        />
                        <div className="absolute inset-0 bg-linear-to-b from-primary/90 via-primary/70 to-primary/95" />
                    </div>
                )}
                <div className="container relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-4xl mx-auto"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold tracking-widest uppercase mb-6">
                            {heroData.subtitle}
                        </span>
                        <h1 className="text-5xl lg:text-7xl font-bold font-playfair text-white mb-6 leading-tight whitespace-pre-line">
                            {heroData.title}
                        </h1>
                        <p className="text-xl text-white/60 font-medium max-w-2xl mx-auto">
                            {heroData.description}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Featured Story Hero Card */}
            {featuredStory && (
                <section className="py-12 -mt-16 relative z-20">
                    <div className="container">
                        <motion.div
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-white rounded-[40px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-gray-100"
                        >
                            <div className="lg:col-span-4 bg-surface flex items-center justify-center p-12">
                                <div className="flex flex-col items-center">
                                    <div className="w-48 h-48 rounded-full bg-white shadow-xl flex items-center justify-center border-8 border-surface p-1 mb-8 relative">
                                        <div className="w-full h-full rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-6xl font-black">
                                            {featuredStory.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gold rounded-full flex items-center justify-center text-white shadow-lg">
                                            <Trophy className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-bold text-primary mb-1">{featuredStory.name}</h3>
                                    <p className="text-accent font-bold tracking-widest uppercase text-xs">{featuredStory.category} | Batch {featuredStory.batch}</p>
                                </div>
                            </div>
                            <div className="lg:col-span-8 p-8 lg:p-16 flex flex-col justify-center">
                                <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-6 leading-tight">
                                    &quot;{featuredStory.headline}&quot;
                                </h2>
                                <div className="space-y-4 text-text/70 leading-relaxed mb-8">
                                    <p>{featuredStory.summary}</p>
                                    <p className="line-clamp-3">
                                        {featuredStory.story}
                                    </p>
                                </div>
                                <Link href="#stories-grid" className="btn btn-primary w-fit px-8 h-14 rounded-2xl flex items-center gap-3">
                                    Explore More Stories <ChevronDown className="w-5 h-5 animate-bounce" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Stats Strip */}
            <section className="py-20 bg-primary text-white overflow-hidden relative">
                <div className="container relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 text-center">
                        {STATS.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="text-4xl lg:text-5xl font-black text-gold mb-2">
                                    <Counter value={stat.value} duration={2.5} suffix={stat.suffix} />
                                </div>
                                <p className="text-xs lg:text-sm font-bold tracking-widest uppercase text-white/50">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-1/4 h-full bg-linear-to-l from-white/5 to-transparent pointer-events-none" />
            </section>

            {/* Filterable Grid Section */}
            <section id="stories-grid" className="py-24 bg-surface">
                <div className="container">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                        <div>
                            <span className="text-accent font-bold tracking-widest uppercase text-sm">Our Impact</span>
                            <h2 className="text-4xl font-bold font-playfair text-primary mt-2">Hall of Fame</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveTab(cat)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-xl text-sm font-bold transition-all",
                                        activeTab === cat
                                            ? "bg-accent text-white shadow-lg shadow-accent/20"
                                            : "bg-white text-text/60 hover:text-accent border border-gray-100"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredStories.map((story) => (
                                <motion.div
                                    key={story._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <StoryCard story={story} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {filteredStories.length === 0 && (
                        <div className="text-center py-24">
                            <Rocket className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <p className="text-text/40 font-medium">No stories found in this category yet. Stay tuned!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="container">
                    <div className="bg-primary/5 rounded-[3rem] p-8 lg:p-20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[100px] rounded-full -mr-32 -mt-32" />
                        <div className="relative z-10 max-w-3xl">
                            <h2 className="text-3xl lg:text-5xl font-bold font-playfair text-primary mb-8">
                                Want to be the next <span className="text-accent underline underline-offset-8">Success Story?</span>
                            </h2>
                            <p className="text-lg text-text/70 mb-10 leading-relaxed font-medium">
                                Join MP Kids School and embark on a journey that identifies your strengths, nurtures your talents, and prepares you for global excellence.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/admissions" className="btn btn-primary px-10 h-14 text-base font-bold rounded-2xl">
                                    Begin Admission Journey
                                </Link>
                                <Link href="/contact" className="btn bg-white border border-gray-200 text-primary px-10 h-14 text-base font-bold rounded-2xl hover:bg-surface transition-colors flex items-center justify-center gap-2 group">
                                    Talk to an Expert <ExternalLink className="w-4 h-4 text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
