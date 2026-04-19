"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Music,
    Palette,
    Cpu,
    MessageSquare,
    FlaskConical,
    Flag,
    Camera,
    Trophy,
    Sun,
    Leaf,
    BookOpen,
    Dribbble,
    Compass,
    Mic2,
    CheckCircle2,
    Send,
    Star,
    Sparkles,
    Users,
    Activity,
    Clock
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { IStaticPage } from '@/models/StaticPage';

interface CoCurricularClientProps {
    pageData: IStaticPage | null;
}

const defaultActivities = [
    {
        name: "Music Club",
        icon: <Music className="w-6 h-6" />,
        desc: "Vocal and instrumental training covering both Indian Classical and Western styles.",
        age: "Class 3-12",
        schedule: "Every Wed, 2:00-4:00 PM",
        color: "bg-blue-500"
    },
    {
        name: "Dance Academy",
        icon: <Mic2 className="w-6 h-6" />,
        desc: "Fusion of Bharatanatyam, Kathak, and contemporary dance forms.",
        age: "Class 1-12",
        schedule: "Every Tue & Thu, 3:00-4:30 PM",
        color: "bg-rose-500"
    },
    {
        name: "Art & Craft",
        icon: <Palette className="w-6 h-6" />,
        desc: "Unleash creativity through painting, sculpture, and origami.",
        age: "Class Nur-12",
        schedule: "Every Mon, 2:30-4:00 PM",
        color: "bg-amber-500"
    },
    {
        name: "Robotics Club",
        icon: <Cpu className="w-6 h-6" />,
        desc: "Building and programming autonomous robots for real-world challenges.",
        age: "Class 6-12",
        schedule: "Every Fri, 2:00-5:00 PM",
        color: "bg-slate-700"
    },
    {
        name: "Debate Society",
        icon: <MessageSquare className="w-6 h-6" />,
        desc: "Enhancing public speaking and critical thinking through structured arguments.",
        age: "Class 8-12",
        schedule: "Every Sat, 10:00 AM-12:00 PM",
        color: "bg-indigo-600"
    },
    {
        name: "Science Club",
        icon: <FlaskConical className="w-6 h-6" />,
        desc: "Hands-on experiments and innovation projects beyond the curriculum.",
        age: "Class 5-10",
        schedule: "Every Wed, 3:00-4:30 PM",
        color: "bg-emerald-600"
    },
    {
        name: "NCC",
        icon: <Flag className="w-6 h-6" />,
        desc: "National Cadet Corps training for discipline, unity, and patriotism.",
        age: "Class 9-12",
        schedule: "Every Sat, 7:00-9:00 AM",
        color: "bg-green-700"
    },
    {
        name: "Scouts & Guides",
        icon: <Compass className="w-6 h-6" />,
        desc: "Outdoor skills and community service for younger students.",
        age: "Class 4-8",
        schedule: "Every Fri, 3:00-5:00 PM",
        color: "bg-orange-600"
    },
    {
        name: "Photography Club",
        icon: <Camera className="w-6 h-6" />,
        desc: "Mastering light, composition, and digital editing of visual stories.",
        age: "Class 7-12",
        schedule: "Every Tue, 3:30-5:00 PM",
        color: "bg-pink-500"
    },
    {
        name: "Chess Club",
        icon: <Activity className="w-6 h-6" />,
        desc: "Strategy and concentration sessions for beginners and masters.",
        age: "Class 2-12",
        schedule: "Every Mon & Wed, 3:00-4:00 PM",
        color: "bg-zinc-800"
    },
    {
        name: "Football Academy",
        icon: <Trophy className="w-6 h-6" />,
        desc: "Professional coaching focus on teamwork and physical endurance.",
        age: "Class 5-12",
        schedule: "Daily, 6:30-8:00 AM",
        color: "bg-lime-600"
    },
    {
        name: "Basketball",
        icon: <Dribbble className="w-6 h-6" />,
        desc: "Elite court training and inter-school tournament preparation.",
        age: "Class 6-12",
        schedule: "Mon to Fri, 4:00-6:00 PM",
        color: "bg-orange-500"
    },
    {
        name: "Yoga & Meditation",
        icon: <Sun className="w-6 h-6" />,
        desc: "Cultivating mental peace and physical flexibility through Asanas.",
        age: "Class Nur-12",
        schedule: "Daily, 8:00-8:30 AM",
        color: "bg-yellow-500"
    },
    {
        name: "Environmental Club",
        icon: <Leaf className="w-6 h-6" />,
        desc: "Promoting sustainability through gardening and conservation campaigns.",
        age: "Class 4-10",
        schedule: "Every Thu, 2:30-4:00 PM",
        color: "bg-green-500"
    },
    {
        name: "Literary Club",
        icon: <BookOpen className="w-6 h-6" />,
        desc: "Creative writing, poetry slams, and annual magazine production.",
        age: "Class 6-12",
        schedule: "Every Fri, 2:30-4:00 PM",
        color: "bg-purple-600"
    }
];

const defaultAchievements = [
    "Robotics Club won State Championship 2024",
    "Debate team runners-up National Level",
    "U-17 Football Team won Inter-School Trophy",
    "Photography Club exhibition at City Art Gallery",
    "Chess team qualified for Zonal level masters",
    "Eco Club received 'Green School' certificate",
    "Music Group won 1st Prize in State Harmony Meet"
];

export function CoCurricularClient({ pageData }: CoCurricularClientProps) {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: '', class: '', activity: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    email: "",
                    message: `Student Name: ${formData.name}\nClass: ${formData.class}\nActivity: ${formData.activity}`,
                    enquiryType: "CoCurricular",
                    source: "Co-Curricular Form"
                })
            });

            if (response.ok) {
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 3000);
                setFormData({ name: '', class: '', activity: '', phone: '' });
            } else {
                console.error("Submission failed", await response.text());
                alert("Failed to submit. Please try again.");
            }
        } catch (error) {
            console.error("Submission failed", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const title = pageData?.title || "Beyond the Classroom";
    const subtitle = pageData?.subtitle || "Holistic Growth";
    const description = pageData?.description || "We nurture hidden talents and build character through a rich spectrum of co-curricular activities, ensuring every student finds their passion.";

    const clubSection = pageData?.sections?.find(s => s.title.toLowerCase().includes("club")) || {
        title: "Clubs & Societies",
        content: "Explore our diverse range of clubs designed to develop skills in art, tech, sports, and leadership."
    };

    const activitiesSection = pageData?.sections?.find(s => s.key === "activities");
    const dynamicActivities = activitiesSection?.items?.length ? activitiesSection.items : defaultActivities;

    const achievementsSection = pageData?.sections?.find(s => s.key === "achievements");
    const dynamicAchievements = achievementsSection?.items?.length
        ? achievementsSection.items.map((i: any) => i.title || '')
        : defaultAchievements;

    const getIcon = (iconData: any) => {
        if (typeof iconData !== 'string') return iconData;
        const IconComponent = (LucideIcons as any)[iconData] || LucideIcons.Star;
        return <IconComponent className="w-6 h-6" />;
    };

    return (
        <div className="min-h-screen bg-surface">
            {/* Hero Section */}
            <section data-hero-dark="true" className="relative h-[450px] flex items-center bg-primary overflow-hidden pt-32 pb-16">
                <div className="container relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-gold mb-6 backdrop-blur-sm border border-white/10">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-xs font-bold tracking-widest uppercase text-white">{subtitle}</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
                            {title.split(' Classroom')[0]} <span className="text-gold italic">{title.includes('Classroom') ? 'Classroom' : ''}</span>
                        </h1>
                        <p className="text-xl text-white/70 font-inter leading-relaxed max-w-2xl mb-12">
                            {description}
                        </p>
                    </motion.div>
                </div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/10 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none" />
            </section>

            {/* 4. Achievements Ticker */}
            <div className="bg-primary border-y border-white/10 py-4 overflow-hidden relative">
                <style jsx>{`
                    .ticker-scroll {
                        display: flex;
                        width: fit-content;
                        animation: scroll 30s linear infinite;
                    }
                    @keyframes scroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .ticker-item {
                        padding: 0 50px;
                        color: white;
                        font-weight: 700;
                        white-space: nowrap;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    }
                `}</style>
                <div className="ticker-scroll">
                    {[...dynamicAchievements, ...dynamicAchievements].map((ach: any, idx: number) => (
                        <div key={idx} className="ticker-item">
                            <Star className="w-5 h-5 text-gold fill-gold" />
                            {ach}
                        </div>
                    ))}
                </div>
            </div>

            <main className="py-20 lg:py-28">
                <div className="container overflow-hidden">
                    {/* 2. Activity Categories */}
                    <div className="mb-32">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">{clubSection.title}</h2>
                            <div
                                className="text-gray-500 max-w-2xl mx-auto prose prose-slate"
                                dangerouslySetInnerHTML={{ __html: clubSection.content || "" }}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {dynamicActivities.map((act: any, idx: number) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: (idx % 3) * 0.1 }}
                                    className="group relative bg-white p-8 rounded-4xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300"
                                >
                                    <div className={`w-14 h-14 ${act.color || 'bg-blue-500'} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:rotate-6 transition-transform`}>
                                        {getIcon(act.icon)}
                                    </div>
                                    <h3 className="text-2xl font-serif font-bold text-primary mb-3">{act.name}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 h-10 line-clamp-2">{act.desc}</p>

                                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                        <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase">
                                            <Users className="w-4 h-4" /> {act.age}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-gold uppercase">
                                            <Clock className="w-4 h-4" /> {act.schedule?.split(',')[0]}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* 3. Why Co-Curricular Section */}
                    <section className="mb-32">
                        <div className="bg-slate-50 rounded-[3rem] p-12 md:p-16 lg:p-20 relative overflow-hidden">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-8 leading-tight">
                                        Why engagement <span className="text-gold italic underline underline-offset-8">matters?</span>
                                    </h2>
                                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                        Scientific studies show that students involved in co-curricular activities score 15% higher in academic assessments and exhibit better stress-management skills.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {[
                                        { title: 'Builds Confidence', text: 'Performing on stage or in the court removes stage fright.' },
                                        { title: 'Develops Leadership', text: 'Managing clubs and teams builds real-world leadership.' },
                                        { title: 'Time Management', text: 'Balancing school and clubs improves focus and efficiency.' },
                                        { title: 'Hidden Talents', text: 'Safe spaces to explore and discover untethered creativity.' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all">
                                            <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary mb-4">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                            <h4 className="font-bold text-primary mb-2">{item.title}</h4>
                                            <p className="text-gray-500 text-xs leading-relaxed">{item.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 5. How to Join Section */}
                    <section id="register">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-stretch">
                            <div>
                                <h2 className="text-4xl font-serif font-bold text-primary mb-12">How to Join</h2>
                                <div className="space-y-12">
                                    {[
                                        { step: '01', title: 'Fill Interest Form', desc: 'Indicate your preferred clubs and availability through our simple online form.' },
                                        { step: '02', title: 'Attend Trial Session', desc: 'Meet the mentors and participate in a sample activity to see if it\'s a fit.' },
                                        { step: '03', title: 'Get Confirmed', desc: 'Receive your formal induction into the club and start your journey.' }
                                    ].map((s, idx) => (
                                        <div key={idx} className="flex gap-8 group">
                                            <div className="text-5xl font-serif font-bold text-slate-100 group-hover:text-gold transition-colors">{s.step}</div>
                                            <div>
                                                <h4 className="text-xl font-bold text-primary mb-2">{s.title}</h4>
                                                <p className="text-gray-500 leading-relaxed">{s.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-slate-200 border border-slate-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-bl-[4rem]" />
                                <h3 className="text-2xl font-serif font-bold text-primary mb-8 relative z-10">Register Your Interest</h3>

                                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Student Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                                            placeholder="Enter full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            required
                                            pattern="[0-9]{10}"
                                            title="10 digit phone number"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                                            placeholder="Enter 10-digit phone number"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Current Class</label>
                                        <select
                                            required
                                            value={formData.class}
                                            onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                                        >
                                            <option value="">Select Class</option>
                                            {[...Array(12)].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>Class {i + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Activity</label>
                                        <select
                                            required
                                            value={formData.activity}
                                            onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                                        >
                                            <option value="">Select Activity</option>
                                            {defaultActivities.map((act) => (
                                                <option key={act.name} value={act.name}>{act.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-5 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-3"
                                    >
                                        Submit Registration <Send className="w-5 h-5" />
                                    </button>
                                </form>

                                <AnimatePresence>
                                    {submitted && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="absolute inset-0 z-20 bg-primary/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 text-white"
                                        >
                                            <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mb-6 shadow-2xl">
                                                <CheckCircle2 className="w-10 h-10 text-primary" />
                                            </div>
                                            <h4 className="text-3xl font-serif font-bold mb-4">Registration Sent!</h4>
                                            <p className="text-white/80 max-w-xs uppercase tracking-widest text-xs font-bold">
                                                Our activity coordinator will contact you shortly for trial sessions.
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
