'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    GraduationCap,
    Award,
    Clock,
    MessageSquare,
    ChevronRight
} from 'lucide-react';

interface FacultyMember {
    _id: string;
    name: string;
    designation: string;
    department: string;
    subject?: string;
    qualification?: string;
    experience?: string;
    imageUrl?: string;
    bio?: string;
}

interface FacultyViewProps {
    faculty: FacultyMember[];
}

const departments = [
    { id: 'all', label: 'All' },
    { id: 'science', label: 'Science', color: 'bg-blue-500' },
    { id: 'math', label: 'Mathematics', color: 'bg-emerald-500' },
    { id: 'languages', label: 'Languages', color: 'bg-amber-500' },
    { id: 'social', label: 'Social Science', color: 'bg-purple-500' },
    { id: 'commerce', label: 'Commerce', color: 'bg-indigo-500' },
    { id: 'arts', label: 'Arts & PE', color: 'bg-rose-500' },
    { id: 'cs', label: 'Computer Science', color: 'bg-slate-700' }
];

const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export default function FacultyView({ faculty }: FacultyViewProps) {
    const [activeDept, setActiveDept] = useState('all');

    const filteredFaculty = activeDept === 'all'
        ? faculty
        : faculty.filter(f => f.department.toLowerCase() === activeDept.toLowerCase());

    return (
        <section className="mb-32">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
                <div>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-4">Faculty Directory</h2>
                    <p className="text-slate-500 max-w-xl">Filter by department to explore our diverse group of teaching staff across all disciplines.</p>
                </div>

                <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl">
                    {departments.map((dept) => (
                        <button
                            key={dept.id}
                            onClick={() => setActiveDept(dept.id)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeDept === dept.id
                                ? 'bg-white text-primary shadow-md'
                                : 'text-slate-500 hover:text-primary'
                                }`}
                        >
                            {dept.label}
                        </button>
                    ))}
                </div>
            </div>

            <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
            >
                <AnimatePresence>
                    {filteredFaculty.map((teacher) => {
                        const deptInfo = departments.find(d => d.id === teacher.department.toLowerCase()) || departments[1];
                        return (
                            <motion.div
                                layout
                                key={teacher._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group"
                            >
                                <div className={`w-20 h-20 ${deptInfo.color} text-white rounded-full flex items-center justify-center text-xl font-bold mb-6 ring-8 ring-slate-50 group-hover:ring-slate-100 transition-all`}>
                                    {getInitials(teacher.name)}
                                </div>
                                <h4 className="text-lg font-bold text-primary mb-1">{teacher.name}</h4>
                                <p className="text-secondary text-sm font-bold mb-3">{teacher.subject || teacher.designation}</p>

                                <div className="w-full pt-4 border-t border-slate-50 space-y-1.5">
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-tighter">Qualification</p>
                                    <p className="text-sm font-medium text-slate-700">{teacher.qualification}</p>
                                    <p className="text-xs text-slate-400 mt-2">{teacher.experience} of mentoring</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </motion.div>
        </section>
    );
}
