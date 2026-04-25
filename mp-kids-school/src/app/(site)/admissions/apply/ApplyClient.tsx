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
    settingsData: {
        schoolName: string;
        contactEmail?: string;
        contactPhone?: string;
    } | null;
}

export default function ApplyClient({ pageData, settingsData }: ApplyClientProps) {
    const hero = {
        title: pageData?.title || "Student Registration",
        description: pageData?.description || "Complete the form below to initiate the admission process for the academic session 2026-27.",
        subtitle: pageData?.subtitle || "Apply Online"
    };

    const classesSection = pageData?.sections?.find(s => s.type === 'classes' || s.id === 'available_classes');

    let availableClasses = ['Nursery', 'KG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '11'];
    if (classesSection?.content) {
        if (typeof classesSection.content === 'string') {
            availableClasses = classesSection.content.split(',').map((c: string) => c.trim()).filter(Boolean);
        } else if (classesSection.content.classes) {
            // Fallback for old seed data
            availableClasses = classesSection.content.classes;
        }
    }

    const contactPhone = settingsData?.contactPhone || '+91 90919 29384';
    const contactEmail = settingsData?.contactEmail || 'admissions@mpkidsschool.edu';
    const schoolName = settingsData?.schoolName || 'MP Kids School';

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
                    <AdmissionForm availableClasses={availableClasses} schoolName={schoolName} />

                    <div className="mt-16 text-center text-slate-400 text-sm">
                        <p>© 2026 {schoolName}. All data is securely encrypted.</p>
                        <p className="mt-2 text-slate-500">Need help? Call us at {contactPhone} or email {contactEmail}</p>
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
