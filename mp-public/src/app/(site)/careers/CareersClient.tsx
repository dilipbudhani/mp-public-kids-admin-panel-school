"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase, MapPin, GraduationCap, Clock, Users, Building2,
    TrendingUp, Heart, CheckCircle2, ChevronRight, X, FileText,
    Phone, Mail, Upload, BookOpen, Shield, Star
} from 'lucide-react';

/* ─────────────────────── DATA ─────────────────────── */

type JobCategory = 'Teaching' | 'Non-Teaching' | 'Admin';

interface JobData {
    _id: string;
    title: string;
    department: string;
    category: JobCategory;
    experience: string;
    qualification: string;
    type: 'Full-time' | 'Part-time';
    location: string;
    vacancies: number;
}

interface CareersClientProps {
    initialJobs?: JobData[];
    pageData?: {
        title?: string;
        subtitle?: string;
        description?: string;
        bannerImage?: string;
        [key: string]: unknown;
    };
}

const DEFAULT_JOBS: JobData[] = [
    { _id: 'pgt-physics', title: 'PGT Physics', department: 'Science', category: 'Teaching', experience: '3+ Years', qualification: 'M.Sc. Physics + B.Ed', type: 'Full-time', location: 'Indore, MP', vacancies: 1 },
    { _id: 'pgt-maths', title: 'PGT Mathematics', department: 'Mathematics', category: 'Teaching', experience: '2+ Years', qualification: 'M.Sc. Mathematics + B.Ed', type: 'Full-time', location: 'Indore, MP', vacancies: 2 },
    { _id: 'tgt-english', title: 'TGT English', department: 'Languages', category: 'Teaching', experience: '1+ Years', qualification: 'MA English + B.Ed', type: 'Full-time', location: 'Indore, MP', vacancies: 1 },
    { _id: 'prt-class', title: 'PRT Class Teacher', department: 'Primary', category: 'Teaching', experience: 'Fresher OK', qualification: 'B.Ed / D.El.Ed', type: 'Full-time', location: 'Indore, MP', vacancies: 3 },
    { _id: 'cs-teacher', title: 'Computer Science Teacher', department: 'Computer Science', category: 'Teaching', experience: '2+ Years', qualification: 'MCA / B.Tech + B.Ed', type: 'Full-time', location: 'Indore, MP', vacancies: 1 },
    { _id: 'librarian', title: 'Librarian', department: 'Library', category: 'Non-Teaching', experience: '2+ Years', qualification: 'B.Lib / M.Lib', type: 'Full-time', location: 'Indore, MP', vacancies: 1 },
    { _id: 'sports-coach', title: 'Sports Coach – Football', department: 'Physical Education', category: 'Non-Teaching', experience: '3+ Years', qualification: 'Sports background / NSNIS', type: 'Full-time', location: 'Indore, MP', vacancies: 1 },
    { _id: 'accountant', title: 'Accountant', department: 'Finance', category: 'Admin', experience: '3+ Years', qualification: 'B.Com / CA Inter', type: 'Full-time', location: 'Indore, MP', vacancies: 1 },
    { _id: 'front-desk', title: 'Front Desk Executive', department: 'Administration', category: 'Admin', experience: '1+ Years', qualification: 'Graduate (Any Stream)', type: 'Full-time', location: 'Indore, MP', vacancies: 2 },
];

const BENEFITS = [
    {
        icon: <TrendingUp className="w-7 h-7" />,
        title: 'Growth-Oriented Culture',
        desc: 'Regular training workshops, CPD programmes, and leadership pathways help every team member grow professionally and personally year after year.',
        color: '#3B82F6',
    },
    {
        icon: <Star className="w-7 h-7" />,
        title: 'Competitive Salary',
        desc: 'Industry-standard pay scales, performance bonuses, provident fund, medical insurance, and additional allowances that put us above peers in the region.',
        color: '#F59E0B',
    },
    {
        icon: <Building2 className="w-7 h-7" />,
        title: 'Modern Infrastructure',
        desc: 'Smart classrooms with projectors, a fully-equipped science block, a 20,000-book library, and a dedicated teacher lounge — designed to inspire.',
        color: '#10B981',
    },
    {
        icon: <Heart className="w-7 h-7" />,
        title: 'Work-Life Balance',
        desc: 'Fixed school-hour schedules, 60+ annual paid leaves including summer breaks, and a no-weekend-work policy so you can be fully present at home.',
        color: '#EC4899',
    },
];

const STEPS = [
    { step: '01', title: 'Application Review', desc: 'Our HR team carefully reviews your resume and qualifications, usually within 3 working days of submission.' },
    { step: '02', title: 'Telephonic Screening', desc: 'A brief 15-minute call with our HR to discuss your background, experience, and expectations.' },
    { step: '03', title: 'Demo Class / Interview', desc: 'Shortlisted candidates are invited for a panel interview. Teaching roles require a 20-minute demo lesson.' },
    { step: '04', title: 'Offer Letter', desc: 'Selected candidates receive a formal offer letter within 48 hours of the final decision.' },
];

const CATEGORY_COLORS: Record<JobCategory, string> = {
    Teaching: '#3B82F6',
    'Non-Teaching': '#10B981',
    Admin: '#8B5CF6',
};

type FilterTab = 'All' | JobCategory;
const FILTER_TABS: FilterTab[] = ['All', 'Teaching', 'Non-Teaching', 'Admin'];

/* ─────────────────────── APPLICATION FORM ─────────────────────── */

interface AppFormProps {
    job: JobData;
    onClose: () => void;
}

function ApplicationForm({ job, onClose }: AppFormProps) {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '', email: '', phone: '', position: job.title,
        qualification: '', experience: '', currentOrg: '', coverLetter: '',
    });
    const [fileName, setFileName] = useState('');
    const [fileObj, setFileObj] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) {
            setFileName(f.name);
            setFileObj(f);
        }
    };

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.name.trim()) errs.name = 'Name is required';
        if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Valid email required';
        if (!form.phone.match(/^[0-9]{10}$/)) errs.phone = '10-digit phone number required';
        if (!form.qualification.trim()) errs.qualification = 'Qualification is required';
        if (!form.experience.trim()) errs.experience = 'Experience detail is required';
        return errs;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setLoading(true);
        try {
            let resumeUrl = "";
            if (fileObj) {
                const formData = new FormData();
                formData.append("file", fileObj);
                formData.append("documentType", "Resume");
                formData.append("applicationNo", "Career_" + Date.now());

                const upRes = await fetch("/api/admissions/upload", {
                    method: "POST",
                    body: formData,
                });
                if (upRes.ok) {
                    const data = await upRes.json();
                    if (data.success) {
                        resumeUrl = data.url;
                    }
                }
            }

            // Using the lead endpoint to capture career applications
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    enquiryType: 'Career',
                    message: `Position: ${form.position}\nQualification: ${form.qualification}\nExperience: ${form.experience}\nOrganization: ${form.currentOrg}\nCover Letter: ${form.coverLetter}${resumeUrl ? '\nResume URL: ' + resumeUrl : ''}`,
                    sourcePage: 'Careers',
                    priority: 'High'
                }),
            });

            if (res.ok) {
                setSubmitted(true);
            } else {
                const errorData = await res.text().catch(() => "Unknown error");
                console.error("API Error Response:", errorData);
                alert("An error occurred while submitting your application. Please check your inputs and try again.");
            }
        } catch (error) {
            console.error("Failed to submit application:", error);
            alert("Network error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const inputCls = (field: string) =>
        `w-full bg-neutral-50 border ${errors[field] ? 'border-red-400 focus:ring-red-200' : 'border-neutral-200 focus:ring-primary/20 focus:border-primary'} rounded-xl px-4 py-3 text-sm text-neutral-800 focus:outline-none focus:ring-2 transition-all placeholder:text-neutral-400`;
    const labelCls = "block text-xs font-bold uppercase tracking-widest text-primary/60 mb-1.5";

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl border border-neutral-100 p-10 text-center shadow-lg"
            >
                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-gold/30">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-2xl font-playfair font-bold text-primary mb-2">Application Submitted!</h4>
                <p className="text-neutral-500 max-w-sm mx-auto mb-6">
                    Thank you <strong>{form.name}</strong>! We will contact you within <strong>5 working days</strong>.
                </p>
                <button onClick={onClose} className="text-sm font-bold text-primary underline underline-offset-2">
                    Close
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden"
        >
            {/* Form header */}
            <div className="bg-primary px-6 py-5 flex items-start justify-between gap-4">
                <div>
                    <p className="text-gold text-xs font-bold uppercase tracking-widest mb-1">Applying For</p>
                    <h3 className="text-white font-playfair font-bold text-xl">{job.title}</h3>
                    <p className="text-white/60 text-sm">{job.department} · {job.location}</p>
                </div>
                <button onClick={onClose} className="text-white/60 hover:text-white transition-colors mt-1 shrink-0">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelCls}>Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" className={inputCls('name')} />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                    <label className={labelCls}>Email Address *</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className={inputCls('email')} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                    <label className={labelCls}>Phone Number *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit mobile" maxLength={10} className={inputCls('phone')} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                    <label className={labelCls}>Position Applied For</label>
                    <input name="position" value={form.position} readOnly className={`${inputCls('position')} bg-neutral-100 cursor-not-allowed text-neutral-500`} />
                </div>
                <div>
                    <label className={labelCls}>Highest Qualification *</label>
                    <input name="qualification" value={form.qualification} onChange={handleChange} placeholder="e.g. M.Sc. Physics, B.Ed" className={inputCls('qualification')} />
                    {errors.qualification && <p className="text-red-500 text-xs mt-1">{errors.qualification}</p>}
                </div>
                <div>
                    <label className={labelCls}>Years of Experience *</label>
                    <input name="experience" value={form.experience} onChange={handleChange} placeholder="e.g. 4 years at DPS Indore" className={inputCls('experience')} />
                    {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
                </div>
                <div className="md:col-span-2">
                    <label className={labelCls}>Current School / Organization</label>
                    <input name="currentOrg" value={form.currentOrg} onChange={handleChange} placeholder="Where are you currently working?" className={inputCls('currentOrg')} />
                </div>
                <div className="md:col-span-2">
                    <label className={labelCls}>Upload Resume</label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="flex-1 flex items-center gap-3 bg-neutral-50 border border-neutral-200 border-dashed rounded-xl px-4 py-3 hover:border-primary hover:bg-primary/5 transition-all">
                            <Upload className="w-4 h-4 text-neutral-400 group-hover:text-primary shrink-0 transition-colors" />
                            <span className={`text-sm truncate ${fileName ? 'text-neutral-700' : 'text-neutral-400'}`}>
                                {fileName || 'Click to choose PDF, DOC, or DOCX'}
                            </span>
                        </div>
                        <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFile} />
                    </label>
                </div>
                <div className="md:col-span-2">
                    <label className={labelCls}>Cover Letter <span className="normal-case font-normal text-neutral-400 tracking-normal">(optional)</span></label>
                    <textarea
                        name="coverLetter" value={form.coverLetter} onChange={handleChange}
                        rows={4} placeholder="Tell us why you'd be a great fit for this role..."
                        className={`${inputCls('coverLetter')} resize-none`}
                    />
                </div>
                <div className="md:col-span-2 pt-2 flex gap-3">
                    <button
                        type="submit" disabled={loading}
                        className="flex-1 bg-primary text-white py-3.5 rounded-xl font-bold transition-all hover:bg-primary/90 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading
                            ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Submitting...</>
                            : <><FileText className="w-4 h-4" /> Submit Application</>
                        }
                    </button>
                    <button type="button" onClick={onClose} className="px-6 py-3.5 rounded-xl border border-neutral-200 text-neutral-600 font-bold hover:bg-neutral-50 transition-all">
                        Cancel
                    </button>
                </div>
            </form>
        </motion.div>
    );
}

/* ─────────────────────── JOB CARD ─────────────────────── */

function JobCard({ job, onApply }: { job: JobData; onApply: (job: JobData) => void }) {
    const color = CATEGORY_COLORS[job.category];
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            layout
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col"
        >
            <div className="h-1.5 w-full" style={{ backgroundColor: color }} />
            <div className="p-6 flex flex-col gap-4 flex-1">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="font-bold text-primary text-lg leading-tight">{job.title}</h3>
                        <p className="text-sm text-neutral-500 mt-0.5">{job.department}</p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1.5 rounded-full shrink-0" style={{ backgroundColor: `${color}18`, color }}>
                        {job.category}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <Clock className="w-4 h-4 shrink-0 text-neutral-400" />
                        {job.experience}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <MapPin className="w-4 h-4 shrink-0 text-neutral-400" />
                        {job.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500 col-span-2">
                        <GraduationCap className="w-4 h-4 shrink-0 text-neutral-400" />
                        {job.qualification}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <Briefcase className="w-4 h-4 shrink-0 text-neutral-400" />
                        {job.type}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <Users className="w-4 h-4 shrink-0 text-neutral-400" />
                        {job.vacancies} Vacanc{job.vacancies === 1 ? 'y' : 'ies'}
                    </div>
                </div>

                <button
                    onClick={() => onApply(job)}
                    className="mt-auto w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2"
                    style={{ backgroundColor: `${color}15`, color }}
                    onMouseEnter={e => { const el = e.currentTarget; el.style.backgroundColor = color; el.style.color = 'white'; }}
                    onMouseLeave={e => { const el = e.currentTarget; el.style.backgroundColor = `${color}15`; el.style.color = color; }}
                >
                    Apply Now <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
}

/* ─────────────────────── MAIN PAGE ─────────────────────── */

export default function CareersClient({ initialJobs = [], pageData }: CareersClientProps) {
    const jobList = initialJobs.length > 0 ? initialJobs : DEFAULT_JOBS;
    const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
    const [activeForm, setActiveForm] = useState<JobData | null>(null);

    // Banner data from CMS with fallbacks
    const banner = {
        title: pageData?.title || "Join Our Team",
        subtitle: pageData?.subtitle || "We're Hiring",
        description: pageData?.description || "Be part of a passionate team shaping the future of education — one student at a time.",
        image: pageData?.bannerImage
    };

    const filteredJobs = activeFilter === 'All' ? jobList : jobList.filter(j => j.category === activeFilter);

    const scrollToJobs = () => {
        document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <main className="bg-neutral-50 min-h-screen">

            {/* ─── 1. HERO ─────────────────────────────────── */}
            <section
                className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
                data-hero-dark="true"
            >
                <div className="absolute inset-0 bg-primary">
                    <div className="absolute inset-0 opacity-[0.07]"
                        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1.5px, transparent 0)', backgroundSize: '36px 36px' }}
                    />
                    <div className="absolute inset-0 bg-linear-to-br from-[#001a3a] via-primary to-[#002a55]" />
                    {banner.image && (
                        <div className="absolute inset-0 z-0">
                            <div className="absolute inset-0 bg-primary/60 z-10" />
                            <img
                                src={banner.image}
                                alt="Careers Hero"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                    )}
                    {/* Wave bottom */}
                    <svg className="absolute bottom-0 left-0 w-full z-10" viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none">
                        <path d="M0 120 C480 40 960 40 1440 120 L1440 120 L0 120Z" fill="rgb(250,250,249)" />
                    </svg>
                </div>

                {/* Decorative rings */}
                <div className="absolute right-[8%] top-1/2 -translate-y-1/2 hidden xl:block">
                    <div className="w-72 h-72 rounded-full border border-gold/15" />
                    <div className="absolute inset-8 rounded-full border border-gold/10" />
                    <div className="absolute inset-16 rounded-full bg-gold/5" />
                </div>

                <div className="relative z-20 container max-w-6xl px-6 mt-16 text-left">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
                        <span className="inline-flex items-center text-gold font-bold text-sm uppercase tracking-[0.3em] mb-6 border border-gold/30 rounded-full px-5 py-2 bg-gold/10 backdrop-blur-sm">
                            {banner.subtitle}
                        </span>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold text-white mb-6 leading-tight">
                            {banner.title.includes(' ') ? (
                                <>
                                    {banner.title.split(' ').slice(0, -1).join(' ')} <br /><span className="text-gold">{banner.title.split(' ').slice(-1)}</span>
                                </>
                            ) : (
                                banner.title
                            )}
                        </h1>
                        <p className="text-white/75 text-xl md:text-2xl leading-relaxed mb-12">
                            {banner.description}
                        </p>
                        <button
                            onClick={scrollToJobs}
                            className="bg-gold text-primary font-bold px-10 py-4 rounded-full hover:bg-white transition-all hover:scale-105 shadow-xl text-lg inline-block"
                        >
                            View Open Positions ↓
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* ─── 2. WHY WORK WITH US ─────────────────────── */}
            <section className="py-24 bg-neutral-50">
                <div className="container px-6 max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-sm font-bold uppercase tracking-[0.25em] text-gold">Our Culture</span>
                        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary mt-3 mb-4">Why Work With Us</h2>
                        <p className="text-neutral-500 text-lg max-w-2xl mx-auto">More than a job — a place where educators thrive, grow, and make a lasting impact.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {BENEFITS.map((b, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl p-7 border border-neutral-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4"
                            >
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                                    style={{ backgroundColor: b.color }}>
                                    {b.icon}
                                </div>
                                <h3 className="font-bold text-primary text-lg leading-tight">{b.title}</h3>
                                <p className="text-neutral-500 text-sm leading-relaxed">{b.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── 3. OPEN POSITIONS ───────────────────────── */}
            <section id="open-positions" className="py-24 bg-white border-t border-neutral-100 scroll-mt-20">
                <div className="container px-6 max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-sm font-bold uppercase tracking-[0.25em] text-gold">Current Openings</span>
                        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary mt-3 mb-4">Open Positions</h2>
                        <p className="text-neutral-500 text-lg">
                            {jobList.length} positions open · Indore, Madhya Pradesh
                        </p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-2 justify-center mb-12">
                        {FILTER_TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => { setActiveFilter(tab); setActiveForm(null); }}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeFilter === tab
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                    }`}
                            >
                                {tab}
                                <span className="ml-2 text-xs opacity-60">
                                    ({tab === 'All' ? jobList.length : jobList.filter(j => j.category === tab).length})
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Job Grid */}
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredJobs.map(job => (
                                <JobCard key={job._id} job={job} onApply={(j) => {
                                    setActiveForm(j);
                                }} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>

            {/* MODAL FORM */}
            <AnimatePresence>
                {activeForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveForm(null)}
                            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
                        />
                        <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl bg-white">
                            <ApplicationForm
                                job={activeForm}
                                onClose={() => setActiveForm(null)}
                            />
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* ─── 4. HIRING PROCESS ───────────────────────── */}
            <section className="py-24 bg-primary relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.06]"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
                />
                <div className="container relative z-10 px-6 max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-sm font-bold uppercase tracking-[0.25em] text-gold">Our Process</span>
                        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mt-3">How We Hire</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-0 relative">
                        {/* Connector line */}
                        <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-white/15" />

                        {STEPS.map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="flex flex-col items-center text-center px-4 relative"
                            >
                                <div className="w-20 h-20 rounded-full bg-gold flex items-center justify-center text-primary font-playfair font-bold text-2xl shadow-xl shadow-gold/30 mb-6 relative z-10">
                                    {s.step}
                                </div>
                                <h3 className="font-bold text-white text-base mb-2">{s.title}</h3>
                                <p className="text-white/55 text-sm leading-relaxed">{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="text-center mt-16">
                        <p className="text-white/60 mb-4">Have questions about the process?</p>
                        <a href="mailto:careers@mpkidsschool.edu.in"
                            className="inline-flex items-center gap-2 text-gold font-bold hover:underline underline-offset-2">
                            <Mail className="w-4 h-4" /> careers@mpkidsschool.edu.in
                        </a>
                    </div>
                </div>
            </section>

        </main>
    );
}
