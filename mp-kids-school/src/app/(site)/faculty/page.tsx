import React from 'react';
import {
    Users,
    GraduationCap,
    Award,
    Clock,
    MessageSquare,
    ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import FacultyView from '@/components/faculty/FacultyView';
import { dbConnect } from "@/lib/mongodb";
import Faculty from '@/models/Faculty';
import StaticPage from '@/models/StaticPage';

export const metadata = {
    title: "Our Faculty | MP Kids School",
    description: "Meet our dedicated team of educators and mentors committed to excellence in education.",
};

const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export default async function FacultyPage() {
    await dbConnect();

    // Fetch all faculty members
    const facultyMembers = await Faculty.find({ isActive: true, schoolIds: process.env.SCHOOL_ID }).sort({ order: 1 }).lean();

    // Fetch leadership (Principal, Vice Principal, Directors)
    const leadership = await Faculty.find({
        isActive: true,
        schoolIds: process.env.SCHOOL_ID,
        designation: { $in: [/Principal/i, /Director/i, /Chairman/i] }
    }).sort({ order: 1 }).lean();

    // Fetch page content
    const pageData = await StaticPage.findOne({ slug: 'faculty', schoolIds: process.env.SCHOOL_ID }).lean();

    const heroContent = {
        title: pageData?.title || "Our Intellectual Backbone",
        subtitle: pageData?.subtitle || "Meet Our Educators",
        description: pageData?.description || "A dedicated team of highly qualified mentors, subject matter experts, and visionaries committed to nurturing global citizens."
    };

    // Calculate stats dynamicly or use defaults
    const stats = [
        { label: "Total Faculty", value: `${facultyMembers.length}+`, icon: <Users className="w-5 h-5" /> },
        { label: "PhD Holders", value: facultyMembers.filter(f => f.qualification?.includes('Ph.D') || f.qualification?.includes('PhD')).length.toString(), icon: <Award className="w-5 h-5" /> },
        { label: "Expert Mentors", value: facultyMembers.length > 0 ? "85%" : "0%", icon: <Clock className="w-5 h-5" /> },
        { label: "Teacher-Student", value: "1:25", icon: <GraduationCap className="w-5 h-5" /> }
    ];

    const leadershipColors = ['bg-primary', 'bg-accent', 'bg-secondary'];

    return (
        <div className="min-h-screen bg-white">
            {/* 1. Hero Section */}
            <section
                data-hero-dark="true"
                className="relative h-[450px] flex items-center bg-primary overflow-hidden pt-32 pb-16"
            >
                <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-3 text-secondary mb-4">
                            <GraduationCap className="w-8 h-8" />
                            <span className="text-sm font-bold tracking-[0.3em] uppercase">{heroContent.subtitle}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                            {heroContent.title.split(' ').map((word, i) =>
                                word.toLowerCase() === 'backbone' ? <span key={i} className="text-secondary"> {word}</span> : ` ${word}`
                            )}
                        </h1>
                        <p className="text-xl text-white/70 font-sans leading-relaxed max-w-2xl mb-12">
                            {heroContent.description}
                        </p>
                    </div>
                </div>
                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none" />
            </section>

            <main className="py-20 lg:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
                    {/* 2. Leadership Team */}
                    {leadership.length > 0 && (
                        <div className="mb-32">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-4">Academic Leadership</h2>
                                <p className="text-slate-500 max-w-2xl mx-auto">The visionaries steering the school towards academic excellence and holistic growth.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {leadership.map((member, idx) => (
                                    <div
                                        key={member._id.toString()}
                                        className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                                    >
                                        <div className={`absolute top-0 right-0 w-24 h-24 ${leadershipColors[idx % 3]}/10 rounded-bl-[4rem] group-hover:w-full group-hover:h-full group-hover:rounded-none transition-all duration-500`} />

                                        <div className="relative z-10">
                                            <div className={`w-20 h-20 ${leadershipColors[idx % 3]} text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 shadow-lg`}>
                                                {getInitials(member.name)}
                                            </div>
                                            <h3 className="text-2xl font-serif font-bold text-primary mb-1">{member.name}</h3>
                                            <p className="text-secondary font-bold text-sm uppercase tracking-wider mb-4">{member.designation}</p>

                                            <div className="space-y-2 mb-6">
                                                <p className="text-slate-600 text-sm flex items-center gap-2">
                                                    <Award className="w-4 h-4 text-primary" /> {member.qualification}
                                                </p>
                                                <p className="text-slate-600 text-sm flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-primary" /> {member.experience} EXP
                                                </p>
                                            </div>

                                            {member.bio && (
                                                <div className="pt-6 border-t border-slate-100 mt-auto">
                                                    <p className="text-slate-500 italic text-sm leading-relaxed flex gap-2">
                                                        <MessageSquare className="w-4 h-4 shrink-0 text-secondary" />
                                                        "{member.bio}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 3. Stats Bar */}
                    <div
                        className="bg-primary rounded-[2.5rem] p-8 md:p-12 mb-32 shadow-2xl relative overflow-hidden"
                    >
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative z-10">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="flex items-center gap-4 text-white">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                                        <div className="text-xs uppercase tracking-widest text-white/60">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 4. Department-wise Faculty Grid */}
                    <FacultyView faculty={JSON.parse(JSON.stringify(facultyMembers))} />

                    {/* 5. Join Our Team CTA */}
                    <div className="bg-slate-50 rounded-[3rem] p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative">
                        <div className="relative z-10 text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-accent mb-4">We're hiring passionate educators</h2>
                            <p className="text-slate-600 max-w-lg">Become part of a vibrant ecosystem dedicated to educational excellence and innovation.</p>
                        </div>

                        <a
                            href="/careers"
                            className="relative z-10 px-8 py-4 bg-primary text-white rounded-full font-bold shadow-xl hover:scale-105 transition-transform flex items-center gap-3"
                        >
                            View Openings < ChevronRight className="w-5 h-5" />
                        </a>

                        {/* Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32" />
                    </div>
                </div>
            </main>
        </div>
    );
}
