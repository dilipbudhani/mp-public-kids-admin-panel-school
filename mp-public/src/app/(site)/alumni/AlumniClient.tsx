"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Quote, GraduationCap, MapPin, Briefcase, Calendar, ExternalLink, ChevronLeft, ChevronRight, CheckCircle2, Users, Globe, Award, Stethoscope, TrendingUp } from 'lucide-react';

/* ───────────────────────── DATA ───────────────────────── */

interface AlumniData {
    _id?: string;
    initials: string;
    color: string;
    name: string;
    batch: number;
    profession: string;
    org: string;
    city: string;
    quote: string;
}

interface AlumniClientProps {
    initialAlumni?: AlumniData[];
    pageData?: any;
}

const DEFAULT_ALUMNI: AlumniData[] = [
    { initials: 'AK', color: '#3B82F6', name: 'Arjun Kumar', batch: 2008, profession: 'IAS Officer', org: 'Government of Rajasthan', city: 'Jaipur', quote: 'MP Public School gave me the discipline and hunger to serve the nation.' },
    { initials: 'PM', color: '#8B5CF6', name: 'Priya Mehra', batch: 2010, profession: 'Research Scientist, NASA', org: 'NASA Jet Propulsion Lab', city: 'Pasadena, USA', quote: 'The curiosity I developed here took me all the way to the stars.' },
    { initials: 'RS', color: '#10B981', name: 'Rohit Sharma', batch: 2005, profession: 'Senior Consultant', org: 'Deloitte India', city: 'Mumbai', quote: 'Every habit of excellence was instilled at MP Public School.' },
    { initials: 'NK', color: '#F59E0B', name: 'Neha Kapoor', batch: 2012, profession: 'Doctor (MBBS, MD)', org: 'AIIMS New Delhi', city: 'New Delhi', quote: 'Compassion in medicine starts with compassion in education—I learned both here.' },
    { initials: 'VT', color: '#EC4899', name: 'Vikram Tiwari', batch: 2003, profession: 'Brigadier, Indian Army', org: 'Indian Armed Forces', city: 'Pune', quote: 'The school taught me that integrity is not an option—it is a way of life.' },
    { initials: 'SA', color: '#EF4444', name: 'Sneha Agarwal', batch: 2015, profession: 'Founder & CEO', org: 'UrbanNest Technologies', city: 'Bengaluru', quote: 'MP built my grit. Everything else followed.' },
    { initials: 'DC', color: '#0EA5E9', name: 'Devraj Chaudhary', batch: 2001, profession: 'Chartered Accountant', org: 'PricewaterhouseCoopers', city: 'Chennai', quote: 'My foundation in numbers and ethics came directly from this school.' },
    { initials: 'AG', color: '#14B8A6', name: 'Ananya Gupta', batch: 2017, profession: 'National Athlete', org: 'Athletics Federation of India', city: 'Hyderabad', quote: 'The sports programs here honed not just my body, but my competitive spirit.' },
    { initials: 'KJ', color: '#6366F1', name: 'Karan Joshi', batch: 2009, profession: 'IIT Graduate / Product Manager', org: 'Google India', city: 'Gurugram', quote: 'The academic rigour here made IIT feel like the next natural step.' },
    { initials: 'MB', color: '#D97706', name: 'Meenakshi Bhatt', batch: 2013, profession: 'Civil Engineer', org: 'L&T Infrastructure', city: 'Ahmedabad', quote: 'My teachers showed me that precision and passion go hand in hand.' },
];

const STATS = [
    { icon: <Users className="w-7 h-7" />, value: 5000, suffix: '+', label: 'Alumni Worldwide' },
    { icon: <Globe className="w-7 h-7" />, value: 15, suffix: '', label: 'Countries Represented' },
    { icon: <Award className="w-7 h-7" />, value: 120, suffix: '+', label: 'In Government Services' },
    { icon: <TrendingUp className="w-7 h-7" />, value: 200, suffix: '+', label: 'Entrepreneurs' },
    { icon: <Stethoscope className="w-7 h-7" />, value: 300, suffix: '+', label: 'Medicine & Engineering' },
];

const TESTIMONIALS = [
    {
        quote: "MP Public School didn't just educate me—it shaped my entire worldview. From the morning assemblies to the science fairs, every moment pushed me to ask better questions and think more carefully. I carry the school's values with me every day in my research at NASA, and I'm grateful for every teacher who didn't let me settle for less.",
        name: 'Priya Mehra', batch: 2010, designation: 'Research Scientist, NASA JPL',
    },
    {
        quote: "When I cracked the UPSC, my first thought was of my teachers at MP Public School. They instilled in me a sense of duty so deep that the idea of serving the country never felt abstract. The school's environment—disciplined yet nurturing—was the perfect training ground for the civil services.",
        name: 'Arjun Kumar', batch: 2008, designation: 'IAS Officer, Government of Rajasthan',
    },
    {
        quote: "I remember staying back after school hours in the chemistry lab, running experiments long past the bell. No one asked me to—I simply loved it. That environment where curiosity was celebrated took me first to AIIMS and now to some of the most critical medical research in the country.",
        name: 'Neha Kapoor', batch: 2012, designation: 'Senior Physician, AIIMS New Delhi',
    },
    {
        quote: "The entrepreneurial mindset wasn't something I picked up at a business school. It started in Class 10, when my computer teacher challenged me to build a website from scratch. That project, that push, that belief—it's what gave me the confidence to launch UrbanNest, which now serves over 2 million users.",
        name: 'Sneha Agarwal', batch: 2015, designation: 'Founder & CEO, UrbanNest Technologies',
    },
    {
        quote: "In the army, you have to trust your team with your life. That trust begins with character. The PT sessions, the NCC camps, the debate competitions at MP Public School—they collectively forged the leader in me. Every jawaan under my command benefits from what I learned here between the age of ten and seventeen.",
        name: 'Vikram Tiwari', batch: 2003, designation: 'Brigadier, Indian Army',
    },
];

const EVENTS = [
    {
        name: 'Annual Alumni Meet 2025',
        date: 'December 21, 2025',
        location: 'MP Public School Campus, New Delhi',
        type: 'In-Person',
        color: '#3B82F6',
        desc: 'A grand reunion of all batches. Relive memories, reconnect with batchmates, and celebrate the school\'s legacy over an evening of performances, awards, and dinner.',
    },
    {
        name: 'North India Regional Meetup',
        date: 'September 14, 2025',
        location: 'The Oberoi, Jaipur',
        type: 'In-Person',
        color: '#10B981',
        desc: 'For alumni based in Rajasthan, UP, and Punjab. An informal networking dinner bringing together professionals from diverse fields.',
    },
    {
        name: 'Career Insights Webinar',
        date: 'July 5, 2025',
        location: 'Online (Zoom)',
        type: 'Online',
        color: '#F59E0B',
        desc: 'Distinguished alumni from tech, finance, and civil services share insights on career building, mentorship, and personal growth with current students and young graduates.',
    },
];

const BATCH_YEARS = Array.from({ length: 30 }, (_, i) => 2024 - i);

/* ───────────────────────── ANIMATED COUNTER ───────────────────────── */

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    const motionVal = useMotionValue(0);
    const spring = useSpring(motionVal, { duration: 1800, bounce: 0 });
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (inView) motionVal.set(value);
    }, [inView, value, motionVal]);

    useEffect(() => {
        return spring.on('change', (v) => setDisplay(Math.floor(v)));
    }, [spring]);

    return (
        <span ref={ref} className="tabular-nums">
            {display.toLocaleString('en-IN')}{suffix}
        </span>
    );
}

/* ───────────────────────── TESTIMONIALS CAROUSEL ───────────────────────── */

function TestimonialsCarousel() {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);
    const total = TESTIMONIALS.length;

    useEffect(() => {
        if (paused) return;
        const t = setInterval(() => setActive(prev => (prev + 1) % total), 5000);
        return () => clearInterval(t);
    }, [paused, total]);

    return (
        <div
            className="relative max-w-4xl mx-auto"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Slides */}
            <div className="overflow-hidden rounded-3xl">
                <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${active * 100}%)` }}
                >
                    {TESTIMONIALS.map((t, i) => (
                        <div key={i} className="w-full shrink-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12">
                            <Quote className="w-10 h-10 text-gold mb-6 opacity-80" />
                            <p className="text-white/90 text-lg md:text-xl leading-relaxed font-light italic mb-8">
                                "{t.quote}"
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
                                    <span className="font-bold text-gold text-sm">{t.name.split(' ').map(n => n[0]).join('')}</span>
                                </div>
                                <div>
                                    <p className="font-bold text-white">{t.name}</p>
                                    <p className="text-white/60 text-sm">Batch of {t.batch} · {t.designation}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mt-8">
                <button
                    onClick={() => setActive(prev => (prev - 1 + total) % total)}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                    aria-label="Previous testimonial"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                {TESTIMONIALS.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActive(i)}
                        className={`rounded-full transition-all duration-300 ${i === active ? 'w-8 h-2.5 bg-gold' : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'}`}
                        aria-label={`Go to testimonial ${i + 1}`}
                    />
                ))}
                <button
                    onClick={() => setActive(prev => (prev + 1) % total)}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                    aria-label="Next testimonial"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

/* ───────────────────────── REGISTRATION FORM ───────────────────────── */

function AlumniForm() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: '', batch: '', city: '', profession: '', organization: '', linkedin: '', email: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/alumni', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    batch: parseInt(form.batch) || new Date().getFullYear(),
                    isActive: false,
                    initials: form.name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A',
                    color: '#3B82F6',
                    quote: 'Proud to be an alumnus of MP Public School!',
                    organization: form.organization || "Independent",
                    profession: form.profession || "Alumnus",
                }),
            });

            if (res.ok) {
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 6000);
            }
        } catch (error) {
            console.error("Failed to register:", error);
        } finally {
            setLoading(false);
        }
    };

    const inputCls = "w-full bg-white border border-neutral-200 rounded-xl px-5 py-3.5 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-neutral-400";
    const labelCls = "block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2";

    return (
        <div className="relative">
            {submitted && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 bg-white rounded-3xl flex flex-col items-center justify-center text-center p-10 shadow-2xl border-2 border-gold/20"
                >
                    <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mb-5 shadow-xl shadow-gold/30">
                        <CheckCircle2 className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="text-2xl font-playfair font-bold text-primary mb-2">Welcome Back!</h4>
                    <p className="text-neutral-600 max-w-sm">
                        Welcome to the <strong>MP Public School Alumni Network!</strong> We'll be in touch shortly.
                    </p>
                    <button
                        onClick={() => setSubmitted(false)}
                        className="mt-6 text-xs font-bold uppercase tracking-widest text-gold hover:underline"
                    >
                        Submit another entry
                    </button>
                </motion.div>
            )}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className={labelCls}>Full Name *</label>
                    <input required name="name" value={form.name} onChange={handleChange} placeholder="Your full name" className={inputCls} />
                </div>
                <div>
                    <label className={labelCls}>Batch Year *</label>
                    <select required name="batch" value={form.batch} onChange={handleChange} className={inputCls}>
                        <option value="">Select your batch</option>
                        {BATCH_YEARS.map(y => <option key={y} value={y}>Batch of {y}</option>)}
                    </select>
                </div>
                <div>
                    <label className={labelCls}>Current City *</label>
                    <input required name="city" value={form.city} onChange={handleChange} placeholder="Where are you based?" className={inputCls} />
                </div>
                <div>
                    <label className={labelCls}>Profession *</label>
                    <input required name="profession" value={form.profession} onChange={handleChange} placeholder="e.g. Software Engineer" className={inputCls} />
                </div>
                <div>
                    <label className={labelCls}>Organization *</label>
                    <input required name="organization" value={form.organization} onChange={handleChange} placeholder="e.g. Google, Microsoft, etc." className={inputCls} />
                </div>
                <div>
                    <label className={labelCls}>Email Address *</label>
                    <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="your.email@example.com" className={inputCls} />
                </div>
                <div>
                    <label className={labelCls}>LinkedIn URL <span className="normal-case font-normal text-neutral-400 tracking-normal">(optional)</span></label>
                    <input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="linkedin.com/in/yourname" className={inputCls} />
                </div>
                <div className="md:col-span-2 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white py-4 rounded-xl font-bold text-base tracking-wide hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                        {loading ? (
                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                        ) : (
                            <><GraduationCap className="w-5 h-5" /> Join the Alumni Network</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

/* ───────────────────────── MAIN PAGE ───────────────────────── */

export default function AlumniClient({ initialAlumni = [], pageData }: AlumniClientProps) {
    const alumniList = initialAlumni.length > 0 ? initialAlumni : DEFAULT_ALUMNI;

    const banner = {
        title: pageData?.title || "Our Pride, Our Alumni",
        subtitle: pageData?.subtitle ?? "Est. 1985 · Alumni Network",
        description: pageData?.description || "Every alumnus of MP Public School carries with them a spirit of integrity and service— building a better India one achievement at a time.",
        image: pageData?.bannerImage
    };

    return (
        <main className="bg-neutral-50 min-h-screen">

            {/* ─── 1. HERO ─────────────────────────────────────────── */}
            <section
                className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
                data-hero-dark="true"
            >
                {/* Background */}
                <div className="absolute inset-0 bg-primary">
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}
                    />
                    <div className="absolute inset-0 bg-linear-to-br from-primary via-primary to-[#001a3a]" />
                    {banner.image && (
                        <div className="absolute inset-0 z-0">
                            <div className="absolute inset-0 bg-primary/60 z-10" />
                            <img
                                src={banner.image}
                                alt="Alumni Hero"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                    )}
                    {/* Decorative arcs */}
                    <svg className="absolute bottom-0 left-0 w-full z-10" viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                        <path d="M0 200 C360 80 1080 80 1440 200 L1440 200 L0 200Z" fill="rgb(250,250,249)" />
                    </svg>
                </div>

                {/* Gold accent ring */}
                <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full border border-gold/20 hidden lg:block" />
                <div className="absolute top-32 right-[12%] w-40 h-40 rounded-full border border-gold/10 hidden lg:block" />
                <div className="absolute bottom-24 left-[8%] w-80 h-80 rounded-full border border-white/5 hidden lg:block" />

                <div className="relative z-20 container max-w-5xl px-6 text-center mt-16">
                    {banner.subtitle && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block text-gold font-bold text-sm uppercase tracking-[0.3em] mb-6 border border-gold/40 rounded-full px-5 py-2 bg-gold/10 backdrop-blur-sm">
                                {banner.subtitle}
                            </span>
                        </motion.div>
                    )}
                    <motion.h1
                        className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold text-white mb-6 leading-tight"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                    >
                        {banner.title.includes(',') ? (
                            <>
                                {banner.title.split(',')[0]},<br />
                                <span className="text-gold">{banner.title.split(',')[1]}</span>
                            </>
                        ) : (
                            banner.title
                        )}
                    </motion.h1>
                    <motion.p
                        className="text-white/75 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        {banner.description}
                    </motion.p>
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.45 }}
                    >
                        <a
                            href="#register"
                            className="btn bg-gold text-primary font-bold px-10 py-4 rounded-full hover:bg-white transition-all hover:scale-105 shadow-xl text-lg"
                        >
                            Join the Network
                        </a>
                        <a
                            href="#alumni-grid"
                            className="btn border border-white/30 text-white font-bold px-10 py-4 rounded-full hover:bg-white/10 transition-all text-lg"
                        >
                            Meet Our Alumni
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* ─── 2. NOTABLE ALUMNI GRID ──────────────────────────── */}
            <section id="alumni-grid" className="py-24 bg-neutral-50">
                <div className="container px-6 max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-sm font-bold uppercase tracking-[0.25em] text-gold">Faces of Excellence</span>
                        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary mt-3 mb-4">Distinguished Alumni</h2>
                        <p className="text-neutral-500 text-lg max-w-2xl mx-auto">From the corridors of MP Public School to the highest offices in India and beyond.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {alumniList.map((a, idx) => (
                            <motion.div
                                key={a.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ delay: (idx % 4) * 0.08, duration: 0.5 }}
                                className="group bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4"
                            >
                                {/* Avatar */}
                                <div className="flex items-start justify-between">
                                    <div
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
                                        style={{ backgroundColor: a.color }}
                                    >
                                        {a.initials}
                                    </div>
                                    <span className="text-xs font-bold text-neutral-400 bg-neutral-100 rounded-full px-3 py-1 mt-1">
                                        Batch {a.batch}
                                    </span>
                                </div>
                                {/* Info */}
                                <div>
                                    <h3 className="font-bold text-primary text-lg leading-tight">{a.name}</h3>
                                    <p className="text-sm font-semibold mt-0.5" style={{ color: a.color }}>{a.profession}</p>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <Briefcase className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                        <p className="text-xs text-neutral-500 truncate">{a.org}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                        <p className="text-xs text-neutral-500">{a.city}</p>
                                    </div>
                                </div>
                                {/* Quote */}
                                <div className="border-t border-neutral-100 pt-4 mt-auto">
                                    <p className="text-xs text-neutral-500 italic leading-relaxed line-clamp-2">"{a.quote}"</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── 3. STATS STRIP ──────────────────────────────────── */}
            <section className="py-20 bg-primary">
                <div className="container px-6 max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                        {STATS.map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex flex-col items-center text-center gap-3"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-gold">
                                    {s.icon}
                                </div>
                                <div className="text-4xl font-playfair font-bold text-white">
                                    <AnimatedCounter value={s.value} suffix={s.suffix} />
                                </div>
                                <p className="text-white/60 text-sm font-medium">{s.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── 4. TESTIMONIALS CAROUSEL ────────────────────────── */}
            <section className="py-24 bg-linear-to-br from-primary via-[#001f47] to-primary relative overflow-hidden">
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
                />
                <div className="container relative z-10 px-6 max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-sm font-bold uppercase tracking-[0.25em] text-gold">In Their Own Words</span>
                        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mt-3">Alumni Testimonials</h2>
                    </div>
                    <TestimonialsCarousel />
                </div>
            </section>

            {/* ─── 5. REGISTRATION FORM ────────────────────────────── */}
            <section id="register" className="py-24 bg-white">
                <div className="container px-6 max-w-4xl mx-auto">
                    <div className="text-center mb-14">
                        <GraduationCap className="w-12 h-12 text-gold mx-auto mb-4" />
                        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-4">Are you an alumnus?</h2>
                        <p className="text-neutral-500 text-lg">Join our official alumni network and stay connected with your batchmates, the school, and exciting opportunities.</p>
                    </div>
                    <div className="bg-neutral-50 rounded-3xl border border-neutral-100 p-8 md:p-12 shadow-lg relative min-h-[400px]">
                        <AlumniForm />
                    </div>
                </div>
            </section>

            {/* ─── 6. UPCOMING EVENTS ──────────────────────────────── */}
            <section className="py-24 bg-neutral-50 border-t border-neutral-100">
                <div className="container px-6 max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-sm font-bold uppercase tracking-[0.25em] text-gold">Mark Your Calendar</span>
                        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary mt-3 mb-4">Upcoming Alumni Events</h2>
                        <p className="text-neutral-500 text-lg">Reconnect, learn, and grow with fellow alumni at our curated events across India and online.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {EVENTS.map((ev, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.12 }}
                                className="bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 flex flex-col"
                            >
                                {/* Color header */}
                                <div className="h-2 w-full" style={{ backgroundColor: ev.color }} />
                                <div className="p-8 flex flex-col gap-4 flex-1">
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-xl font-playfair font-bold text-primary leading-tight">{ev.name}</h3>
                                        <span
                                            className="text-xs font-bold px-3 py-1 rounded-full shrink-0"
                                            style={{ backgroundColor: `${ev.color}20`, color: ev.color }}
                                        >
                                            {ev.type}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                                            <Calendar className="w-4 h-4 shrink-0" style={{ color: ev.color }} />
                                            {ev.date}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                                            <MapPin className="w-4 h-4 shrink-0" style={{ color: ev.color }} />
                                            {ev.location}
                                        </div>
                                    </div>
                                    <p className="text-neutral-600 text-sm leading-relaxed flex-1">{ev.desc}</p>
                                    <Link href="/contact" passHref className="mt-auto w-full">
                                        <button
                                            className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-300"
                                            style={{ backgroundColor: `${ev.color}15`, color: ev.color }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = ev.color; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${ev.color}15`; (e.currentTarget as HTMLButtonElement).style.color = ev.color; }}
                                        >
                                            Register Interest →
                                        </button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

        </main>
    );
}
