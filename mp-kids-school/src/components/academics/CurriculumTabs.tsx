'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Microscope,
    Binary,
    Palette,
    Music,
    Globe
} from 'lucide-react';

const categories = [
    { id: 'primary', title: 'Primary (I-V)', icon: BookOpen },
    { id: 'middle', title: 'Middle (VI-VIII)', icon: Microscope },
    { id: 'secondary', title: 'Secondary (IX-X)', icon: Binary },
    { id: 'senior', title: 'Sr. Secondary (XI-XII)', icon: Globe },
];

const curriculumData = {
    primary: {
        heading: 'Foundational Learning',
        subjects: ['English', 'Mathematics', 'EVS', 'Second Language', 'Information Technology', 'Art & Craft'],
        highlights: 'Focus on literacy, numeracy, and environmental awareness through activity-based learning.',
    },
    middle: {
        heading: 'Conceptual Discovery',
        subjects: ['Science', 'Social Studies', 'Mathematics', 'Three Languages', 'Computer Science', 'Performing Arts'],
        highlights: 'Transition from general to specific subjects with an emphasis on research-driven projects.',
    },
    secondary: {
        heading: 'CBSE Board Rigor',
        subjects: ['Physics', 'Chemistry', 'Biology', 'History/Civics', 'Geography/Economics', 'Math Standard/Basic'],
        highlights: 'Intensive preparation for Board Exams with internal assessments and career counseling.',
    },
    senior: {
        heading: 'Stream Specialization',
        subjects: ['Science (PCM/PCB)', 'Commerce', 'Humanities', 'Applied Mathematics', 'Psychology', 'Economics'],
        highlights: 'In-depth expertise in chosen streams to facilitate university admissions and competitive exams.',
    },
};

export default function CurriculumTabs() {
    const [activeTab, setActiveTab] = useState('primary');

    return (
        <div className="w-full">
            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveTab(cat.id)}
                        className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold transition-all duration-300 ${activeTab === cat.id
                            ? 'bg-secondary text-accent shadow-xl scale-105'
                            : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'
                            }`}
                    >
                        <cat.icon size={20} />
                        {cat.title}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-3xl p-12 shadow-2xl border border-slate-100"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div>
                            <h3 className="text-3xl font-serif text-accent font-bold mb-6 italic">
                                {(curriculumData as any)[activeTab].heading}
                            </h3>
                            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                                {(curriculumData as any)[activeTab].highlights}
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {(curriculumData as any)[activeTab].subjects.map((sub: string) => (
                                    <span key={sub} className="px-4 py-2 bg-slate-50 text-primary font-bold text-xs uppercase tracking-widest rounded-lg border border-slate-100">
                                        {sub}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="relative h-[300px] rounded-2xl overflow-hidden bg-slate-100">
                            {/* This would be an image representive of the level */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                <BookOpen size={120} />
                            </div>
                            <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent" />
                            <div className="absolute bottom-8 left-8">
                                <p className="text-accent font-serif italic text-xl">"Empowering the vision of tomorrow."</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
