"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, TrendingUp, BarChart3 } from 'lucide-react';

interface Stat {
    _id: string;
    label: string;
    value: number;
    suffix: string;
    icon: string;
}

const ICON_MAP: Record<string, any> = {
    Trophy: Trophy,
    Star: Star,
    TrendingUp: TrendingUp,
    BarChart: BarChart3
};

export default function ResultHighlights() {
    const [stats, setStats] = useState<Stat[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="bg-accent rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -mr-48 -mt-48" />

            <div className="relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/3">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Board Results <span className="text-secondary">Highlights</span></h2>
                        <p className="text-white/60 mb-8">Continuing our legacy of academic brilliance with record-breaking performances in CBSE Class X & XII.</p>
                        <button className="px-8 py-3 bg-secondary text-accent font-bold rounded-full hover:bg-white transition-colors">View Merit List</button>
                    </div>

                    <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {isLoading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl h-40 animate-pulse" />
                            ))
                        ) : (
                            stats.map((s, i) => {
                                const IconComponent = ICON_MAP[s.icon] || Star;
                                return (
                                    <motion.div
                                        key={s._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl"
                                    >
                                        <IconComponent className="text-secondary mb-6" size={32} />
                                        <h3 className="text-3xl font-bold mb-2">{s.value}{s.suffix}</h3>
                                        <p className="text-white/50 text-xs uppercase tracking-widest">{s.label}</p>
                                    </motion.div>
                                );
                            })
                        )}

                        {!isLoading && stats.length === 0 && (
                            <div className="col-span-full text-center text-white/30 italic">
                                Performance metrics will be updated soon.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

