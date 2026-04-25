"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bus,
    ShieldCheck,
    Video,
    UserCheck,
    Navigation,
    Search,
    Download,
    Phone,
    Plus,
    Minus,
    CheckCircle2,
    Clock,
    MapPin,
    AlertCircle
} from 'lucide-react';

// --- Data Definitions ---

const busRoutes = [
    { id: "R01", start: "Sector 12", stops: "Main Market, Park Street, Metro Station", pickup: "07:15 AM", drop: "02:45 PM", fee: 1800 },
    { id: "R02", start: "Civil Lines", stops: "Collectorate, City Square, High Street", pickup: "07:00 AM", drop: "03:00 PM", fee: 2200 },
    { id: "R03", start: "Old City", stops: "Clock Tower, Heritage Gate, South Park", pickup: "06:45 AM", drop: "03:15 PM", fee: 2500 },
    { id: "R04", start: "Airport Road", stops: "International Gate, Flying Club, Residency", pickup: "07:10 AM", drop: "02:50 PM", fee: 2000 },
    { id: "R05", start: "Green Valley", stops: "Lake View, Garden Heights, Bloom Park", pickup: "07:20 AM", drop: "02:40 PM", fee: 1900 },
    { id: "R06", start: "Tech Park", stops: "Innovation Hub, Data Center, Cyber Street", pickup: "07:05 AM", drop: "02:55 PM", fee: 2300 },
    { id: "R07", start: "University Enclave", stops: "College Square, Library Road, Hostel Gate", pickup: "06:55 AM", drop: "03:05 PM", fee: 2100 },
    { id: "R08", start: "South Ridge", stops: "Cliff Side, Valley Point, Summit View", pickup: "07:30 AM", drop: "02:30 PM", fee: 1700 },
    { id: "R09", start: "Industrial Area", stops: "Factory Gate, Blue Star, East Link", pickup: "06:40 AM", drop: "03:20 PM", fee: 2600 },
    { id: "R10", start: "Railway Colony", stops: "Platform 1, Station Road, Junction Point", pickup: "07:15 AM", drop: "02:45 PM", fee: 1850 },
];

const faqs = [
    { q: "What if the bus is late?", a: "Parents are notified via SMS alert if a bus is delayed by more than 15 minutes due to traffic or technical issues. You can also track the real-time location via our mobile app." },
    { q: "Can I change my route mid-session?", a: "Route changes are subject to seat availability. You must submit a written request at the school office at least 15 days in advance." },
    { q: "Is transport compulsory?", a: "No, transport is an optional facility. Families living nearby may choose to drop and pick up their children personally." },
    { q: "What is the refund policy for transport fee?", a: "Transport fee is non-refundable if the service is discontinued mid-month. A one-month notice is required for permanent withdrawal from the transport facility." },
    { q: "How do I get route info updates?", a: "All updates regarding timing changes, driver contact info, or route diversions are communicated through the school's official WhatsApp broadcast and SMS." }
];

// --- Modular Components ---

const FAQItem = ({ q, a }: { q: string, a: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-100 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-6 text-left group transition-colors hover:text-primary"
            >
                <span className="text-lg font-bold text-primary/80 group-hover:text-primary transition-colors">{q}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-primary text-white rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-gray-500 leading-relaxed max-w-3xl">{a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function TransportPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRoutes = busRoutes.filter(route =>
        route.start.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.stops.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        className="max-w-4xl"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-gold mb-6 backdrop-blur-sm border border-white/10">
                            <Navigation className="w-4 h-4" />
                            <span className="text-xs font-bold tracking-widest uppercase text-white">State-of-the-Art Fleet</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6 leading-tight">
                            Safe & Reliable <span className="text-gold italic">Transport</span>
                        </h1>
                        <p className="text-xl text-white/70 font-inter leading-relaxed max-w-2xl mb-12">
                            Our GPS-tracked fleet and trained personnel ensure that your child's journey to and from school is secure, punctual, and comfortable.
                        </p>
                    </motion.div>
                </div>
                {/* Graphics */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gold/10 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none" />
            </section>

            {/* 2. Features Strip */}
            <div className="container -mt-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: 'GPS Tracked', desc: 'Real-time location sharing via mobile app.', icon: <MapPin className="text-blue-500" /> },
                        { title: 'AC Buses', desc: 'Climate controlled for student comfort.', icon: <Bus className="text-emerald-500" /> },
                        { title: 'CCTV Cameras', desc: 'Surveillance on all active routes.', icon: <Video className="text-rose-500" /> },
                        { title: 'Trained Personnel', desc: 'Verified drivers and female attendants.', icon: <UserCheck className="text-amber-500" /> }
                    ].map((f, i) => (
                        <div key={i} className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-50 flex flex-col items-center text-center group translate-y-0 hover:-translate-y-2 transition-all duration-300">
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                                <div className="group-hover:text-white transition-colors">{f.icon}</div>
                            </div>
                            <h3 className="text-lg font-bold text-primary mb-2">{f.title}</h3>
                            <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <main className="py-24 lg:py-32">
                <div className="container">
                    {/* 3. Bus Routes Table */}
                    <div className="mb-32">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                            <div>
                                <h2 className="text-3xl md:text-5xl font-playfair font-bold text-primary mb-4 text-center md:text-left">Route Directory</h2>
                                <p className="text-gray-500 text-center md:text-left">Find your zone and check timings for the 2025-26 academic session.</p>
                            </div>

                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-primary" />
                                <input
                                    type="text"
                                    placeholder="Search by area or stop name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-primary hover:underline"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-4xl border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100">
                                            <th className="px-8 py-6 text-sm font-bold text-primary uppercase tracking-wider">Route No</th>
                                            <th className="px-8 py-6 text-sm font-bold text-primary uppercase tracking-wider">Starting Point</th>
                                            <th className="px-8 py-6 text-sm font-bold text-primary uppercase tracking-wider">Key Stops</th>
                                            <th className="px-8 py-6 text-sm font-bold text-primary uppercase tracking-wider text-center">Pickup/Drop</th>
                                            <th className="px-8 py-6 text-sm font-bold text-primary uppercase tracking-wider text-right">Fee (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        <AnimatePresence mode='wait'>
                                            {filteredRoutes.length > 0 ? (
                                                filteredRoutes.map((route, i) => (
                                                    <motion.tr
                                                        key={route.id}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        className="hover:bg-slate-50 transition-colors"
                                                    >
                                                        <td className="px-8 py-6">
                                                            <span className="inline-flex items-center px-3 py-1 bg-primary/5 text-primary rounded-lg font-bold text-xs ring-1 ring-primary/10">
                                                                {route.id}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6 font-bold text-primary">{route.start}</td>
                                                        <td className="px-8 py-6 text-gray-500 text-sm max-w-xs truncate">{route.stops}</td>
                                                        <td className="px-8 py-6 text-center">
                                                            <div className="flex flex-col items-center">
                                                                <span className="text-sm font-bold text-emerald-600 ring-1 ring-emerald-100 bg-emerald-50 px-2 py-0.5 rounded mb-1">{route.pickup}</span>
                                                                <span className="text-sm font-bold text-amber-600 ring-1 ring-amber-100 bg-amber-50 px-2 py-0.5 rounded">{route.drop}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6 text-right font-bold text-primary">₹ {route.fee}/mo</td>
                                                    </motion.tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="px-8 py-20 text-center">
                                                        <div className="flex flex-col items-center gap-4 text-gray-400">
                                                            <AlertCircle className="w-12 h-12" />
                                                            <p className="text-lg">No routes found matching your search.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* 4. Safety Measures */}
                    <div className="mb-32">
                        <div className="bg-slate-50 rounded-[3rem] p-12 md:p-16 lg:p-20 relative overflow-hidden">
                            <div className="flex flex-col lg:flex-row gap-16 items-center">
                                <div className="lg:w-1/2">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 rounded-full text-rose-600 text-xs font-bold uppercase tracking-widest mb-6 border border-rose-100">
                                        <ShieldCheck className="w-4 h-4" /> Safety Protocols
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-8 leading-tight">
                                        Your child's <span className="text-gold">Safety</span> is our top priority.
                                    </h2>
                                    <p className="text-gray-600 text-lg leading-relaxed">
                                        Every vehicle in our fleet undergoes rigorous daily inspections and is monitored in real-time by a central control room.
                                    </p>
                                </div>
                                <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                                    {[
                                        { title: 'Daily Inspection', desc: 'Mechanical audit before every trip.' },
                                        { title: 'Speed Limit 40km/h', desc: 'Strictly enforced and monitored.' },
                                        { title: 'Emergency Info', desc: 'Contact numbers displayed in bus.' },
                                        { title: 'Parent SMS Alerts', desc: 'Live pickup and drop notifications.' },
                                        { title: 'Female Attendants', desc: 'Present on all primary & junior routes.' },
                                        { title: 'First Aid Mandatory', desc: 'Equipped in every single vehicle.' }
                                    ].map((m, idx) => (
                                        <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
                                            <div className="w-8 h-8 bg-primary/5 rounded-full flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                            <h4 className="font-bold text-primary text-sm mb-1">{m.title}</h4>
                                            <p className="text-gray-500 text-[10px] uppercase tracking-wider font-bold">{m.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 5 & 6 Footer Content: Registration & FAQs */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        {/* FAQ Accordion */}
                        <div>
                            <h2 className="text-3xl font-playfair font-bold text-primary mb-12">Common Questions</h2>
                            <div className="divide-y divide-slate-100">
                                {faqs.map((f, i) => (
                                    <FAQItem key={i} q={f.q} a={f.a} />
                                ))}
                            </div>
                        </div>

                        {/* Registration Card */}
                        <div className="flex flex-col gap-8">
                            <div className="bg-primary rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl shadow-primary/30">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[4rem]" />
                                <h3 className="text-3xl font-playfair font-bold mb-6">Avail Transport</h3>
                                <p className="text-white/70 leading-relaxed mb-10 max-w-md">
                                    To register for the transport facility, please submit the registration form at the school office or download it directly from here.
                                </p>

                                <div className="space-y-4">
                                    <a
                                        href="#"
                                        className="w-full py-5 bg-gold text-primary rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
                                    >
                                        <Download className="w-5 h-5" /> Download Form (PDF)
                                    </a>
                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                        <p className="text-xs uppercase tracking-widest text-white/50 mb-2 font-bold">Transport Enquiries</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center text-gold">
                                                <Phone className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold">+91 90919 29384</p>
                                                <p className="text-xs text-white/40">Transport In-charge Desk</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Simple Alert/Note */}
                            <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 flex gap-4">
                                <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
                                <div>
                                    <h4 className="font-bold text-amber-800 text-sm mb-1">Important Note</h4>
                                    <p className="text-amber-700/80 text-xs leading-relaxed">
                                        Transport fee is charged for 11 months in an academic session. Routes are optimized twice a year for efficiency.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
