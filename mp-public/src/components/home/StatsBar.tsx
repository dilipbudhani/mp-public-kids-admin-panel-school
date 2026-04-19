"use client";

import React, { useEffect, useState, useRef } from "react";
import { useInView, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Stat {
    label: string;
    value: number;
    suffix: string;
}

interface StatsBarProps {
    stats: Stat[];
}

export function StatsBar({ stats }: StatsBarProps) {
    if (!stats || stats.length === 0) return null;

    return (
        <div className="bg-primary py-12 lg:py-24 border-y border-white/10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
                    {stats.map((stat, index) => (
                        <StatItem key={index} {...stat} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function StatItem({ label, value, suffix }: Stat) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    return (
        <div ref={ref} className="text-center group">
            <div className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-gold mb-3 flex justify-center items-center">
                <Counter value={value} isInView={isInView} />
                <span className="text-gold">{suffix}</span>
            </div>
            <p className="text-white/60 text-xs md:text-sm uppercase tracking-[0.2em] font-medium leading-relaxed group-hover:text-white transition-colors">
                {label}
            </p>
        </div>
    );
}

function Counter({ value, isInView }: { value: number; isInView: boolean }) {
    const [currentValue, setCurrentValue] = useState(0);

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const duration = 2000; // 2 seconds
            const increment = value / (duration / 16); // 60fps

            const timer = setInterval(() => {
                start += increment;
                if (start >= value) {
                    setCurrentValue(value);
                    clearInterval(timer);
                } else {
                    setCurrentValue(Math.floor(start));
                }
            }, 16);

            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    return <span>{currentValue}</span>;
}
