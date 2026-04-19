"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wallet,
    Truck,
    Info,
    CreditCard,
    Banknote,
    Smartphone,
    HelpCircle,
    Phone,
    Mail,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper to render icon by name
const IconRenderer = ({ name, className }: { name: string; className?: string }) => {
    switch (name) {
        case 'Smartphone': return <Smartphone className={className} />;
        case 'CreditCard': return <CreditCard className={className} />;
        case 'Banknote': return <Banknote className={className} />;
        default: return <Wallet className={className} />;
    }
};

interface FeeHead {
    head: string;
    amount: string;
    frequency: string;
    notes?: string;
}

interface FeeCategory {
    id: string;
    label: string;
    fees: FeeHead[];
}

interface TransportZone {
    zone: string;
    area: string;
    fee: string;
}

interface PaymentMethod {
    name: string;
    iconName: string;
    color: string;
    bg: string;
    note: string;
}

interface ImportantNote {
    title: string;
    text: string;
}

interface FeeClientProps {
    categories: FeeCategory[];
    transportZones: TransportZone[];
    paymentMethods: PaymentMethod[];
    importantNotes: ImportantNote[];
    academicYear: string;
    heroTitle?: string;
    heroDescription?: string;
}

export default function FeeClient({
    categories,
    transportZones,
    paymentMethods,
    importantNotes,
    academicYear,
    heroTitle,
    heroDescription,
}: FeeClientProps) {
    const [activeTab, setActiveTab] = useState(categories[0]?.id || '');

    const currentCategory = categories.find(cat => cat.id === activeTab);

    return (
        <div className="min-h-screen bg-surface">
            {/* 1. Hero Section */}
            <section
                data-hero-dark="true"
                className="relative h-[400px] flex items-center bg-primary overflow-hidden pt-32 pb-16"
            >
                <div className="container relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl"
                    >
                        <div className="flex items-center gap-3 text-gold mb-4">
                            <Wallet className="w-8 h-8" />
                            <span className="text-sm font-bold tracking-[0.3em] uppercase">Investment in Excellence</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6 leading-tight">
                            {heroTitle || 'Fee Structure'}
                            {academicYear && !heroTitle?.includes(academicYear) && (
                                <span className="text-gold ml-3">{academicYear}</span>
                            )}
                        </h1>
                        <p className="text-xl text-white/70 font-inter leading-relaxed max-w-2xl mb-12">
                            {heroDescription || 'We believe in maintaining complete transparency regarding school costs. Our fee structure is designed to reflect the quality of education and facilities provided.'}
                        </p>
                    </motion.div>
                </div>
                {/* Abstract Decorations */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/10 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none" />
            </section>

            <main className="py-20 lg:py-28 relative">
                <div className="container overflow-hidden">
                    {/* 2. Class-wise Fee Tables (Tabs) */}
                    {categories.length > 0 && (
                        <div className="mb-24">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-4">Class-wise Fee Breakdown</h2>
                                <p className="text-gray-600 max-w-xl mx-auto">Select your child's grade category to view the detailed annual fee distribution.</p>
                            </div>

                            {/* Tabs Navigation */}
                            <div className="flex flex-wrap justify-center gap-2 mb-10 p-2 bg-slate-100 rounded-2xl max-w-fit mx-auto">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveTab(cat.id)}
                                        className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === cat.id
                                            ? 'bg-primary text-white shadow-lg'
                                            : 'text-gray-500 hover:bg-white hover:text-primary'
                                            }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
                                >
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-slate-100">
                                                    <th className="px-8 py-5 text-sm font-bold text-primary uppercase tracking-wider">Fee Head</th>
                                                    <th className="px-8 py-5 text-sm font-bold text-primary uppercase tracking-wider">Amount (₹)</th>
                                                    <th className="px-8 py-5 text-sm font-bold text-primary uppercase tracking-wider">Frequency</th>
                                                    <th className="px-8 py-5 text-sm font-bold text-primary uppercase tracking-wider">Description / Notes</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {currentCategory?.fees.map((row, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-8 py-6 font-bold text-gray-800">{row.head}</td>
                                                        <td className="px-8 py-6">
                                                            <span className="text-lg font-bold text-primary">₹ {row.amount}</span>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600 uppercase">
                                                                {row.frequency}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6 text-gray-500 text-sm leading-relaxed">{row.notes}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
                        {/* 3. Transport Fee Table */}
                        {transportZones.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold">
                                        <Truck className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-2xl font-playfair font-bold text-primary">Transport Charges</h2>
                                </div>

                                <div className="overflow-hidden rounded-2xl border border-slate-100">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-100">
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Zone / Area</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Monthly Fee</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {transportZones.map((z, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50/50">
                                                    <td className="px-6 py-5">
                                                        <div className="font-bold text-gray-800">{z.zone}</div>
                                                        <div className="text-xs text-gray-500">{z.area}</div>
                                                    </td>
                                                    <td className="px-6 py-5 text-right font-bold text-primary">₹ {z.fee}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <p className="mt-6 text-sm text-gray-500 italic p-4 bg-slate-50 rounded-xl border-l-4 border-gold">
                                    *Transport fees are payable for 11 months in an academic session. Routes are subject to availability.
                                </p>
                            </motion.section>
                        )}

                        {/* 4. Important Notes Section */}
                        {importantNotes.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                                        <Info className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-2xl font-playfair font-bold text-primary">Terms & Policies</h2>
                                </div>

                                <div className="space-y-6">
                                    {importantNotes.map((note, idx) => (
                                        <div key={idx} className="flex gap-4 group">
                                            <div className="shrink-0 w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-green-500 mt-1">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">{note.title}</h4>
                                                <p className="text-gray-600 text-sm leading-relaxed">{note.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* 5. Payment Methods Section */}
                    {paymentMethods.length > 0 && (
                        <section className="mb-32">
                            <div className="bg-primary rounded-[3rem] p-12 md:p-16 lg:p-20 relative overflow-hidden shadow-3xl shadow-primary/20">
                                <div className="relative z-10 text-center mb-16">
                                    <h2 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-6">Accepted Payment Methods</h2>
                                    <p className="text-white/70 max-w-2xl mx-auto text-lg leading-relaxed">
                                        Choose the most convenient way to complete your fee payments. All transactions are secure and recorded.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                                    {paymentMethods.map((method, idx) => (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ y: -10 }}
                                            className="bg-white rounded-4xl p-10 flex flex-col items-center text-center shadow-2xl shadow-black/5"
                                        >
                                            <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center mb-8", method.bg, method.color)}>
                                                <IconRenderer name={method.iconName} className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-xl font-playfair font-bold text-primary mb-4">{method.name}</h3>
                                            <p className="text-gray-500 text-sm leading-relaxed">{method.note}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Decorative graphics */}
                                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -mr-48 -mt-48" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -ml-32 -mb-32" />
                            </div>
                        </section>
                    )}
                </div>

                {/* 6. Sticky CTA */}
                <div className="fixed bottom-8 left-0 right-0 z-50 px-4 md:px-8 pointer-events-none">
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="max-w-5xl mx-auto bg-white/90 backdrop-blur-xl border border-primary/10 rounded-3xl md:rounded-full p-4 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col md:flex-row items-center justify-between gap-6 pointer-events-auto"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/30">
                                <HelpCircle className="w-6 h-6" />
                            </div>
                            <div className="text-center md:text-left">
                                <h4 className="font-bold text-primary text-lg">Have Questions?</h4>
                                <p className="text-gray-500 text-sm">Contact Admissions Office</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                            <a href="tel:+919876543210" className="flex items-center gap-2 group">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <span className="text-primary font-bold hidden sm:inline">+91 98765 43210</span>
                            </a>
                            <a href="mailto:admissions@mppublicschool.com" className="flex items-center gap-2 group">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <span className="text-primary font-bold hidden sm:inline">admissions@mppublicschool.com</span>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
