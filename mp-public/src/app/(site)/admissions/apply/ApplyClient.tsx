"use client";

import { motion } from 'framer-motion';
import AdmissionForm from '@/components/admissions/AdmissionForm';

interface ApplyClientProps {
    pageData: {
        title: string;
        description?: string;
        subtitle?: string;
        content?: string;
        sections: any[];
    } | null;
}

export default function ApplyClient({ pageData }: ApplyClientProps) {
    const hero = {
        title: pageData?.title || "Student Registration",
        description: pageData?.description || "Complete the form below to initiate the admission process for the academic session 2026-27.",
        subtitle: pageData?.subtitle || "Apply Online"
    };

    return (
        <main className="min-h-screen bg-surface">
            {/* Hero Section */}
            <section data-hero-dark="true" className="relative h-[450px] flex items-center bg-primary overflow-hidden pt-32 pb-16">
                <div className="container relative z-10 text-left text-white px-4 md:px-8">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-playfair font-bold mb-6 max-w-4xl"
                    >
                        {hero.title}
                    </motion.h1>
                    <p className="text-xl text-white/70 max-w-2xl font-inter">
                        {hero.description}
                    </p>
                </div>
            </section>

            {/* Forms Section */}
            <section className="-mt-12 relative z-10 px-4">
                <div className="container mx-auto">
                    <AdmissionForm />

                    <div className="mt-16 text-center text-slate-400 text-sm">
                        <p>© 2026 MP Public School. All data is securely encrypted.</p>
                        <p className="mt-2 text-slate-500">Need help? Call us at +91 98765 43210 or email admissions@excellenceacademy.edu</p>
                    </div>
                </div>
            </section>

            {/* Background Motifs */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10 bg-slate-50">
                {/* Decorative elements could go here if needed */}
            </div>
        </main>
    );
}
