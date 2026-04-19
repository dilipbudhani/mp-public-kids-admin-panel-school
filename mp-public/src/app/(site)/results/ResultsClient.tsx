"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ResultHighlights from '@/components/results/ResultHighlights';
import Image from 'next/image';

interface Achievement {
    _id: string;
    studentName: string;
    class: string;
    year: string;
    marks: string;
    position?: string;
    image?: string;
    category: string;
    isActive: boolean;
}

interface ResultsClientProps {
    pageData: any;
}

export default function ResultsClient({ pageData }: ResultsClientProps) {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const res = await fetch('/api/achievements');
                if (res.ok) {
                    const data = await res.json();
                    setAchievements(data);
                }
            } catch (error) {
                console.error("Failed to fetch achievements:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAchievements();
    }, []);

    const title = pageData?.title || "Consistent Excellence";
    const highlight = pageData?.description || "In Every Endeavor";
    const alumniSection = pageData?.sections?.find((s: any) => s.title === 'Beyond the Campus');

    return (
        <main className="flex flex-col">
            {/* Title */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <span className="text-primary font-bold tracking-widest text-sm uppercase mb-4 inline-block">
                        {pageData?.subtitle || "Academic Hall of Fame"}
                    </span>
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-accent mb-8">
                        {title} <span className="text-secondary italic">{highlight}</span>
                    </h1>
                    <div className="w-24 h-1 bg-secondary mx-auto mb-12" />
                </div>
            </section>

            {/* Highlights Dashboard */}
            <section className="pb-24">
                <div className="container mx-auto px-4">
                    <ResultHighlights />
                </div>
            </section>

            {/* Toppers Cards */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-serif text-accent font-bold mb-16 text-center italic">Merit List & Achievements</h2>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-3xl p-12 h-64 animate-pulse border border-slate-100" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {achievements.filter(a => a.isActive).map((a, i) => (
                                <motion.div
                                    key={a._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col items-center text-center group"
                                >
                                    <div className="relative w-40 h-40 mb-8 rounded-full overflow-hidden border-4 border-secondary/20 group-hover:border-secondary transition-all bg-slate-100">
                                        {a.image ? (
                                            <Image src={a.image} alt={a.studentName} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-2">
                                        <span className="px-2 py-0.5 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-md">
                                            {a.category}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-serif font-bold text-accent mb-2">{a.studentName}</h3>
                                    <div className="text-4xl font-black text-primary mb-2">{a.marks}</div>
                                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-4">
                                        Class {a.class} • {a.year}
                                        {a.position && ` • ${a.position}`}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {!isLoading && achievements.filter(a => a.isActive).length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                            <p className="text-slate-500 italic">No achievements found at the moment.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Alumni Support */}
            <section className="py-24 bg-accent text-white">
                <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <h2 className="text-4xl font-serif font-bold mb-6 italic">
                            {alumniSection?.title || "Beyond the Campus"}
                        </h2>
                        <p className="text-white/60 text-lg mb-8 leading-relaxed">
                            {alumniSection?.content || "Our students consistently find placement in the world's leading universities, carrying the values of MP Public School across the globe."}
                        </p>
                        <div className="grid grid-cols-2 gap-8 font-serif italic text-xl">
                            <div>• IITs & NITs</div>
                            <div>• SRCC & LSR</div>
                            <div>• Ivy League</div>
                            <div>• AIIMS / NEET</div>
                        </div>
                    </div>
                    <div className="lg:w-1/2 w-full h-[300px] bg-white/5 rounded-3xl border border-white/10 overflow-hidden relative">
                        <Image
                            src={alumniSection?.image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1470&auto=format&fit=crop"}
                            alt="Convocation"
                            fill
                            className="object-cover opacity-50 contrast-125"
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}
