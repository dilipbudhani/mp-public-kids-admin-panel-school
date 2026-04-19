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
        <main className="min-h-screen bg-slate-50 pb-24">
            {/* Header Section for Navbar visibility */}
            <section className="bg-primary pt-32 pb-16 mb-16">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-serif text-white font-bold mb-6"
                        >
                            {hero.title}
                        </motion.h1>
                        <p className="text-white/70 text-lg">
                            {hero.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Forms Section */}
            <section className="-mt-12 relative z-10 px-4">
                <div className="container mx-auto">
                    <AdmissionForm />

                    <div className="mt-16 text-center text-slate-400 text-sm">
                        <p>© 2026 MP Kids School. All data is securely encrypted.</p>
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
