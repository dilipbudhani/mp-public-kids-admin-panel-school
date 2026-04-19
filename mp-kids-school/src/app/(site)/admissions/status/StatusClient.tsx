"use client";

import { motion } from 'framer-motion';
import AdmissionStatusTracker from '@/components/admissions/AdmissionStatusTracker';
import { Suspense } from 'react';

interface StatusClientProps {
    pageData: {
        title: string;
        description?: string;
        subtitle?: string;
        content?: string;
        sections: any[];
    } | null;
}

export default function StatusClient({ pageData }: StatusClientProps) {
    const hero = {
        title: pageData?.title || "Check Admission Status",
        description: pageData?.description || "Stay updated on your child's journey. Enter the application number provided during registration to check the current status.",
        subtitle: pageData?.subtitle || "Track Application"
    };

    return (
        <main className="min-h-screen bg-slate-50 pb-24">
            {/* Header Section */}
            <section className="bg-primary pt-32 pb-16 mb-16 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#grid)" />
                    </svg>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-sm font-bold tracking-wider uppercase mb-6"
                    >
                        {hero.subtitle}
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-serif text-white font-bold mb-6"
                    >
                        {hero.title}
                    </motion.h1>
                    <p className="text-white/70 text-lg leading-relaxed">
                        {hero.description}
                    </p>
                </div>
            </section>

            {/* Status Section */}
            <section className="-mt-12 relative z-10">
                <div className="container mx-auto">
                    <Suspense fallback={<div className="text-center py-20">Loading tracker...</div>}>
                        <AdmissionStatusTracker />
                    </Suspense>

                    <div className="mt-16 text-center text-slate-400 text-sm max-w-lg mx-auto px-4">
                        <p className="mb-2 italic">Didn't find what you were looking for?</p>
                        <p className="text-slate-500">For further assistance, feel free to contact our support team at <span className="text-primary font-medium">+91 98765 43210</span></p>
                    </div>
                </div>
            </section>

            {/* Background Motifs */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10 bg-slate-50">
                <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full" />
            </div>
        </main>
    );
}
