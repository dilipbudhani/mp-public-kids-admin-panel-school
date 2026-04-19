"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
    IndianRupee, Baby, MapPin, Users, CheckSquare, FileText,
    Phone, Mail, ExternalLink, ChevronDown, ChevronUp, AlertCircle,
    BookOpen, ClipboardList, Star, Shield
} from 'lucide-react';

/* ─────────────────── TYPES ─────────────────── */

interface RTEClientProps {
    pageData: {
        title: string;
        description?: string;
        subtitle?: string;
        content?: string;
        sections: any[];
    } | null;
}

/* ─────────────────── DATA ─────────────────── */

const ELIGIBILITY = [
    {
        icon: <IndianRupee className="w-6 h-6" />,
        title: 'Income Criteria',
        desc: 'Annual family income below ₹1,00,000 (One Lakh) from all sources as certified by a competent authority.',
        color: '#10B981',
    },
    {
        icon: <Baby className="w-6 h-6" />,
        title: 'Age Criteria',
        desc: 'Child must be 6 years of age as on 1st April of the admission year for entry in Class 1.',
        color: '#3B82F6',
    },
    {
        icon: <MapPin className="w-6 h-6" />,
        title: 'Domicile',
        desc: 'The child must be a resident of the same city or ward as the school, as per the neighbourhood school norms.',
        color: '#F59E0B',
    },
    {
        icon: <Users className="w-6 h-6" />,
        title: 'Category',
        desc: 'Eligible categories: EWS (Economically Weaker Section), SC, ST, OBC-NCL — as per MP state government norms.',
        color: '#8B5CF6',
    },
];

const DOCUMENTS = [
    { doc: 'Birth Certificate (Original + self-attested photocopy)', required: true },
    { doc: 'Aadhaar Card of Child', required: true },
    { doc: 'Aadhaar Card of Parent/Guardian', required: true },
    { doc: 'Income Certificate (issued by Tehsildar / SDM)', required: true },
    { doc: 'Caste Certificate — SC / ST / OBC-NCL (if applicable)', required: false },
    { doc: 'Domicile / Address Proof (utility bill, voter ID, ration card)', required: true },
    { doc: '2 Recent Passport-size Photographs of Child', required: true },
    { doc: 'BPL Card (if applicable)', required: false },
];

const DATES = [
    { label: 'Application Start', date: '01 May 2026', status: 'upcoming' },
    { label: 'Application End', date: '31 May 2026', status: 'upcoming' },
    { label: 'Lottery Date', date: '15 June 2026', status: 'upcoming' },
    { label: 'Admission Deadline', date: '30 June 2026', status: 'upcoming' },
];

const PROCESS_STEPS = [
    {
        n: '01',
        title: 'Apply on State RTE Portal',
        desc: 'Visit the official Madhya Pradesh RTE portal and complete the online application form. Select MP Kids School as your preferred school.',
        link: { label: 'Visit mp.gov.in/rte', href: 'https://rteportal.mp.gov.in' },
    },
    {
        n: '02',
        title: 'Lottery-Based Seat Allotment',
        desc: 'Seats are allotted through a transparent computerised lottery conducted by the state government. Results are published on the portal.',
        link: null,
    },
    {
        n: '03',
        title: 'Report to School with Documents',
        desc: 'If your child is allotted a seat, visit the school within 7 days of allotment with all original documents for verification.',
        link: null,
    },
    {
        n: '04',
        title: 'Admission Confirmed',
        desc: 'After document verification, admission is confirmed at zero cost. No fees of any kind are charged from RTE students.',
        link: null,
    },
];

const FAQS = [
    {
        q: 'Is RTE admission completely free?',
        a: 'Yes. Under Section 12(1)(c) of the RTE Act, private unaided schools must admit children from EWS/disadvantaged groups free of charge. The school cannot charge any fee — tuition, development, or otherwise — from RTE students. The state government reimburses the school at a prescribed rate.',
    },
    {
        q: 'Can a private school refuse to admit an RTE-allotted student?',
        a: 'No. Once a seat is allotted through the official state lottery, the school is legally obligated to admit the child. Refusal is a punishable offence under the RTE Act. Parents may lodge a complaint with the District Education Officer (DEO) if a school refuses.',
    },
    {
        q: 'What if my child is not selected in the lottery?',
        a: 'RTE seats are limited to 25% of Class 1 intake. If your child is not selected in the first lottery, they may be placed on a waiting list. If seats remain after all waiting-list students are accommodated, a second lottery may be held. You can re-apply in the next academic session.',
    },
    {
        q: 'Are textbooks and uniforms provided to RTE students?',
        a: 'Yes. The state government provides free textbooks to RTE students. Schools are also required to provide uniforms as per the Madhya Pradesh government norms. These are supplied at the beginning of the session.',
    },
    {
        q: 'Can I apply to multiple schools under RTE?',
        a: 'Yes. The MP RTE portal allows you to list up to 3 schools in order of preference. Seats are allotted based on your preference list and distance from your residence to the school as per neighbourhood norms.',
    },
    {
        q: 'What happens to my child after Class 8 under RTE?',
        a: 'The RTE Act guarantees free and compulsory education from Class 1 to Class 8. After Class 8, the entitlement under RTE ends. Parents will need to make separate arrangements for Classes 9 onwards, though many state governments offer scholarship schemes for continuation.',
    },
];

/* ─────────────────── FAQ ACCORDION ─────────────────── */

function FAQAccordion() {
    const [open, setOpen] = useState<number | null>(null);
    return (
        <div className="space-y-3 max-w-3xl mx-auto">
            {FAQS.map((faq, i) => (
                <div
                    key={i}
                    className={`border rounded-2xl overflow-hidden transition-all duration-300 ${open === i ? 'border-primary/30 shadow-md' : 'border-neutral-200'}`}
                >
                    <button
                        className="w-full text-left flex items-center justify-between gap-4 px-6 py-5 bg-white hover:bg-neutral-50 transition-colors"
                        onClick={() => setOpen(prev => prev === i ? null : i)}
                        aria-expanded={open === i}
                    >
                        <span className="font-bold text-primary text-sm md:text-base">{faq.q}</span>
                        {open === i
                            ? <ChevronUp className="w-5 h-5 text-primary shrink-0" />
                            : <ChevronDown className="w-5 h-5 text-neutral-400 shrink-0" />
                        }
                    </button>
                    {open === i && (
                        <div className="px-6 pb-5 bg-white border-t border-neutral-100">
                            <p className="text-neutral-600 text-sm leading-relaxed pt-4">{faq.a}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

/* ─────────────────── MAIN PAGE ─────────────────── */

export default function RTEClient({ pageData }: RTEClientProps) {
    const hero = {
        title: pageData?.title || "RTE Admissions",
        description: pageData?.description || "Providing quality education under Section 12(1)(c) of the Right to Education Act, 2009.",
        subtitle: pageData?.subtitle || "Right to Education Act, 2009"
    };

    const sections = pageData?.sections || [];
    const mainSection = sections.find((s: any) => s.order === 0) || {
        title: "What is the RTE Act?",
        content: "The Right of Children to Free and Compulsory Education (RTE) Act, 2009 is a landmark legislation that makes free and compulsory education a fundamental right for all children between the ages of 6 and 14 years in India."
    };

    return (
        <main className="bg-neutral-50 min-h-screen">

            {/* ─── 1. HERO ──────────────────────────────── */}
            <section
                className="relative min-h-[60vh] flex items-center justify-center overflow-hidden"
                data-hero-dark="true"
            >
                <div className="absolute inset-0 bg-primary">
                    <div
                        className="absolute inset-0 opacity-[0.08]"
                        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.3) 39px, rgba(255,255,255,0.3) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.3) 39px, rgba(255,255,255,0.3) 40px)' }}
                    />
                    <div className="absolute inset-0 bg-linear-to-br from-[#001f47] via-primary to-[#003070]" />
                    <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 100" fill="none" preserveAspectRatio="none">
                        <path d="M0 100 L0 60 Q360 0 720 40 Q1080 80 1440 30 L1440 100Z" fill="rgb(250,250,249)" />
                    </svg>
                </div>

                {/* Tricolour accent strip */}
                <div className="absolute top-0 left-0 w-full h-1.5 flex">
                    <div className="flex-1 bg-[#FF9933]" />
                    <div className="flex-1 bg-white" />
                    <div className="flex-1 bg-[#138808]" />
                </div>

                <div className="relative z-10 container max-w-4xl px-6 text-center mt-16 py-16">
                    <div className="inline-flex items-center gap-2 bg-[#FF9933]/20 border border-[#FF9933]/40 rounded-full px-5 py-2 text-[#FFD580] font-bold text-sm uppercase tracking-widest mb-6">
                        <Shield className="w-4 h-4" /> {hero.subtitle}
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair font-bold text-white mb-5 leading-tight">
                        {hero.title.split(' ').slice(0, -1).join(' ')}<br />
                        <span className="text-[#FFD580]">{hero.title.split(' ').slice(-1)}</span>
                    </h1>
                    <p className="text-white/75 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        {hero.description}
                    </p>

                    {/* Key badges */}
                    <div className="flex flex-wrap justify-center gap-3 mt-8">
                        {['25% Seats Reserved', 'Zero Fee', 'Class 1 Entry', 'EWS / SC / ST / OBC-NCL'].map(b => (
                            <span key={b} className="bg-white/10 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full">
                                {b}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── 2. WHAT IS RTE ───────────────────────── */}
            <section className="py-20 bg-neutral-50">
                <div className="container px-6 max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Left: Explainer */}
                        <div>
                            <span className="text-sm font-bold uppercase tracking-[0.25em] text-primary/50">Background</span>
                            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary mt-2 mb-6">{mainSection.title}</h2>
                            <div className="prose prose-neutral text-neutral-600 text-[15px] leading-7 space-y-4">
                                <div dangerouslySetInnerHTML={{ __html: mainSection.content.replace(/\n/g, '<br/>') }} />
                                {sections.filter((s: any) => s.order > 0).map((section: any, idx: number) => (
                                    <div key={idx} className="mt-8">
                                        <h3 className="text-xl font-bold text-primary mb-2">{section.title}</h3>
                                        <div dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br/>') }} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Highlight box */}
                        <div className="lg:sticky lg:top-28">
                            <div className="bg-primary rounded-3xl p-8 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 rounded-full -mr-20 -mt-20 blur-2xl" />
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-gold/20 rounded-2xl flex items-center justify-center mb-6">
                                        <Star className="w-6 h-6 text-gold" />
                                    </div>
                                    <h3 className="text-xl font-playfair font-bold mb-3">Our Commitment</h3>
                                    <p className="text-white/80 text-sm leading-relaxed mb-6">
                                        <strong className="text-gold">MP Kids School</strong> proudly reserves <strong className="text-gold">25% of Class 1 seats</strong> for economically weaker sections and disadvantaged groups, in full compliance with the RTE Act 2009.
                                    </p>
                                    <div className="bg-white/10 rounded-2xl p-5 space-y-3 text-sm">
                                        <div className="flex justify-between"><span className="text-white/60">Entry Class</span><span className="font-bold">Class 1</span></div>
                                        <div className="flex justify-between border-t border-white/10 pt-3"><span className="text-white/60">Reservation</span><span className="font-bold text-gold">25% of intake</span></div>
                                        <div className="flex justify-between border-t border-white/10 pt-3"><span className="text-white/60">Duration</span><span className="font-bold">Class 1 – 8</span></div>
                                        <div className="flex justify-between border-t border-white/10 pt-3"><span className="text-white/60">Cost to Parent</span><span className="font-bold text-green-300">₹0 (Zero)</span></div>
                                    </div>
                                    <div className="mt-5 flex items-start gap-3 bg-[#FF9933]/15 border border-[#FF9933]/30 rounded-xl p-4">
                                        <AlertCircle className="w-5 h-5 text-[#FF9933] shrink-0 mt-0.5" />
                                        <p className="text-white/80 text-xs leading-relaxed">
                                            Applications must be submitted only through the official MP government RTE portal. The school does not accept direct RTE applications.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── 3. ELIGIBILITY ───────────────────────── */}
            <section className="py-20 bg-white border-t border-neutral-100">
                <div className="container px-6 max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-sm font-bold uppercase tracking-[0.25em] text-primary/50">Who Can Apply</span>
                        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary mt-2 mb-3">Eligibility Criteria</h2>
                        <p className="text-neutral-500 max-w-xl mx-auto">All four criteria below must be met for a child to be eligible for RTE admission.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {ELIGIBILITY.map((item, i) => (
                            <div
                                key={i}
                                className="bg-neutral-50 border border-neutral-100 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
                            >
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                                    style={{ backgroundColor: item.color }}
                                >
                                    {item.icon}
                                </div>
                                <h3 className="font-bold text-primary text-base">{item.title}</h3>
                                <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── 4. DOCUMENTS CHECKLIST ───────────────── */}
            <section className="py-20 bg-neutral-50 border-t border-neutral-100">
                <div className="container px-6 max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-sm font-bold uppercase tracking-[0.25em] text-primary/50">Be Prepared</span>
                        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary mt-2 mb-3">Required Documents</h2>
                        <p className="text-neutral-500 max-w-xl mx-auto">Collect and self-attest all documents before visiting the school for admission confirmation.</p>
                    </div>
                    <div className="bg-white border border-neutral-100 rounded-3xl p-8 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {DOCUMENTS.map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className={`mt-0.5 w-5 h-5 rounded shrink-0 flex items-center justify-center border-2 ${item.required ? 'bg-primary border-primary' : 'bg-neutral-100 border-neutral-300'}`}>
                                        <CheckSquare className={`w-3.5 h-3.5 ${item.required ? 'text-white' : 'text-neutral-400'}`} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-neutral-700 font-medium">{item.doc}</p>
                                        {!item.required && (
                                            <p className="text-xs text-neutral-400 mt-0.5">If applicable</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 border-t border-neutral-100 pt-5 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-neutral-500">
                                Bring both originals and photocopies for all documents. Admission will not be confirmed without complete documentation. Documents in regional languages must be accompanied by a Hindi translation.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── 5. APPLICATION PROCESS ───────────────── */}
            <section className="py-20 bg-white border-t border-neutral-100">
                <div className="container px-6 max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-sm font-bold uppercase tracking-[0.25em] text-primary/50">How to Apply</span>
                        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary mt-2 mb-3">Application Process</h2>
                    </div>

                    {/* Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16 relative">
                        <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-0.5 bg-neutral-200" />
                        {PROCESS_STEPS.map((step, i) => (
                            <div key={i} className="flex flex-col items-center text-center relative">
                                <div className="w-16 h-16 rounded-full bg-primary text-white font-playfair font-bold text-xl flex items-center justify-center shadow-xl shadow-primary/20 mb-5 relative z-10">
                                    {step.n}
                                </div>
                                <h3 className="font-bold text-primary text-sm mb-2">{step.title}</h3>
                                <p className="text-neutral-500 text-xs leading-relaxed mb-3">{step.desc}</p>
                                {step.link && (
                                    <a
                                        href={step.link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline underline-offset-2"
                                    >
                                        {step.link.label} <ExternalLink className="w-3 h-3" />
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Important Dates */}
                    <div className="bg-neutral-50 border border-neutral-200 rounded-3xl overflow-hidden">
                        <div className="bg-primary px-8 py-5">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <ClipboardList className="w-5 h-5 text-gold" />
                                Important Dates — Session 2026-27
                            </h3>
                        </div>
                        <div className="divide-y divide-neutral-100">
                            {DATES.map((d, i) => (
                                <div key={i} className="flex items-center justify-between px-8 py-4">
                                    <span className="text-sm text-neutral-600 font-medium">{d.label}</span>
                                    <span className="font-bold text-primary text-sm bg-primary/8 px-4 py-1.5 rounded-full">{d.date}</span>
                                </div>
                            ))}
                        </div>
                        <div className="px-8 py-4 bg-amber-50 border-t border-amber-100 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-700">Dates are indicative and subject to finalisation by the Madhya Pradesh state government. Please check <a href="https://rteportal.mp.gov.in" target="_blank" rel="noopener noreferrer" className="underline font-bold">rteportal.mp.gov.in</a> for official notification.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── 6. FAQ ACCORDION ─────────────────────── */}
            <section className="py-20 bg-neutral-50 border-t border-neutral-100">
                <div className="container px-6 max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-sm font-bold uppercase tracking-[0.25em] text-primary/50">Common Questions</span>
                        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary mt-2 mb-3">Frequently Asked Questions</h2>
                    </div>
                    <FAQAccordion />
                </div>
            </section>

            {/* ─── 7. CONTACT ───────────────────────────── */}
            <section className="py-20 bg-white border-t border-neutral-100">
                <div className="container px-6 max-w-3xl mx-auto text-center">
                    <BookOpen className="w-10 h-10 text-gold mx-auto mb-4" />
                    <h2 className="text-2xl md:text-3xl font-playfair font-bold text-primary mb-2">Have RTE-Related Queries?</h2>
                    <p className="text-neutral-500 mb-8">Our dedicated RTE counsellor is available on all working days between 9:00 AM – 2:00 PM.</p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="tel:+917314001234"
                            className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 justify-center"
                        >
                            <Phone className="w-5 h-5" /> +91 73140 01234
                        </a>
                        <a
                            href="mailto:rte@mppublicschool.edu.in"
                            className="flex items-center gap-3 border-2 border-primary text-primary px-8 py-4 rounded-2xl font-bold hover:bg-primary hover:text-white transition-all justify-center"
                        >
                            <Mail className="w-5 h-5" /> rte@mppublicschool.edu.in
                        </a>
                    </div>

                    <p className="text-xs text-neutral-400 mt-6">
                        For general admissions (non-RTE), visit our{' '}
                        <Link href="/admissions" className="text-primary font-bold hover:underline">Admissions page</Link>.
                    </p>
                </div>
            </section>

        </main>
    );
}
