"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { PlayCircle, MapPin, ChevronLeft, ChevronRight, Video } from 'lucide-react';

const ZONES = [
    { id: 'zone-main', name: 'Main Building', desc: 'The heart of our campus, featuring expansive smart classrooms, staff rooms, and the central administrative offices.', seed: 'school', color: '#3B82F6', icon: <MapPin /> },
    { id: 'zone-science', name: 'Science Block', desc: 'State-of-the-art physics, chemistry, and biology laboratories equipped for hands-on, practical learning.', seed: 'laboratory', color: '#8B5CF6', icon: <MapPin /> },
    { id: 'zone-computer', name: 'Computer Lab', desc: 'High-speed internet and modern workstations designed to foster digital literacy, coding mechanics, and robotics.', seed: 'computer', color: '#10B981', icon: <MapPin /> },
    { id: 'zone-library', name: 'Library', desc: 'A peaceful haven spanning two floors, housing over 20,000 books, journals, and dedicated reading pods.', seed: 'library', color: '#F59E0B', icon: <MapPin /> },
    { id: 'zone-auditorium', name: 'Auditorium', desc: 'Our acoustically treated 800-seater grand venue for cultural events, assemblies, and guest lectures.', seed: 'auditorium', color: '#EC4899', icon: <MapPin /> },
    { id: 'zone-sports', name: 'Sports Ground', desc: 'Sprawling multi-purpose grounds including a football field, cricket pitch, tennis courts, and an Olympic-sized swimming pool.', seed: 'sports', color: '#EF4444', icon: <MapPin /> },
    { id: 'zone-canteen', name: 'Canteen', desc: 'A bright, hygienic, and ventilated space offering daily nutritious meals and snacks for students and staff.', seed: 'canteen', color: '#14B8A6', icon: <MapPin /> },
    { id: 'zone-admin', name: 'Admin Office', desc: 'The central hub for admissions proceedings, finance, general inquiries, and parent meetings.', seed: 'office', color: '#6366F1', icon: <MapPin /> },
];

const STATS = [
    "5 Acres Campus",
    "3 Blocks",
    "48 Classrooms",
    "6 Labs",
    "1 Olympic Pool"
];

export default function VirtualTourClient() {

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const scrollGallery = (id: string, direction: 'left' | 'right') => {
        const el = document.getElementById(`carousel-${id}`);
        if (el) {
            const scrollAmount = direction === 'left' ? -el.clientWidth : el.clientWidth;
            el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <main className="relative bg-neutral-50 min-h-screen">

            {/* 1. Hero Section */}
            <section
                className="relative h-[80vh] md:h-[90vh] flex justify-center items-center overflow-hidden"
                data-hero-dark="true"
            >
                <div className="absolute inset-0 bg-neutral-900 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop"
                        alt="Campus Aerial View"
                        className="w-full h-full object-cover opacity-50 block"
                    />
                    {/* Dynamic Gold Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/80 to-transparent" />
                </div>

                <div className="relative z-10 container text-center max-w-4xl px-4 mt-20">
                    <h1 className="text-5xl md:text-7xl font-bold font-playfair text-white mb-6 drop-shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                        Explore Our Campus
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto drop-shadow-md animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        Take a virtual walk through MP Public School from the comfort of your home. Discover our world-class facilities and vibrant learning spaces.
                    </p>
                    <button
                        onClick={() => scrollTo('interactive-map')}
                        className="btn bg-gold text-primary hover:bg-white px-10 py-4 text-lg font-bold rounded-full transition-all hover:scale-105 shadow-xl hover:shadow-2xl animate-in fade-in slide-in-from-bottom-12 duration-1200 flex items-center gap-3 mx-auto"
                    >
                        <MapPin className="w-5 h-5" />
                        Start Tour
                    </button>
                </div>
            </section>

            {/* Mobile: horizontal sticky stats bar (below navbar) */}
            <div className="xl:hidden sticky top-[72px] z-40 w-full bg-white/90 backdrop-blur-md border-b border-neutral-100 py-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex px-4 gap-6 w-max">
                    {STATS.map((stat, idx) => (
                        <div key={idx} className="flex items-center gap-2 shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
                            <span className="font-bold text-xs text-primary uppercase tracking-wider">{stat}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Flex wrapper: main content + desktop sticky sidebar */}
            <div className="flex items-start gap-0">

                {/* Left: all tour content sections */}
                <div className="flex-1 min-w-0">

                    {/* 2. Interactive Campus Map */}
                    <section id="interactive-map" className="py-24 bg-white relative">
                        <div className="container px-4">
                            <div className="text-center mb-16 max-w-3xl mx-auto">
                                <h2 className="text-4xl font-bold font-playfair text-primary mb-4">Interactive Campus Map</h2>
                                <p className="text-neutral-600 text-lg">Click on any campus zone below to jump right to its gallery and learn more about our state-of-the-art facilities.</p>
                            </div>

                            <div className="max-w-5xl mx-auto">
                                <div className="relative w-full aspect-4/3 md:aspect-video bg-neutral-100 rounded-3xl border-8 border-neutral-200 overflow-hidden shadow-inner">
                                    {/* Minimalist SVG Blueprint */}
                                    <svg viewBox="0 0 1000 600" className="w-full h-full object-cover">
                                        <defs>
                                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e5e5" strokeWidth="1" />
                                            </pattern>
                                        </defs>

                                        {/* Grass Base */}
                                        <rect width="1000" height="600" fill="#f0fdff" />
                                        <rect width="1000" height="600" fill="url(#grid)" />

                                        {/* Main Road/Pathways */}
                                        <path d="M 0 300 Q 500 300 500 600 M 500 300 Q 500 0 800 0 M 200 300 L 200 150 M 500 300 L 900 300 M 500 150 L 800 150" fill="none" stroke="#e5e5e5" strokeWidth="60" strokeLinecap="round" strokeLinejoin="round" />

                                        {/* Interactive Zones */}
                                        {/* Main Building */}
                                        <g className="cursor-pointer group" onClick={() => scrollTo('zone-main')}>
                                            <rect x="50" y="50" width="300" height="150" fill={ZONES[0].color} opacity="0.8" className="transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-1" rx="8" />
                                            <text x="200" y="130" textAnchor="middle" fill="white" fontWeight="bold" fontSize="24" className="pointer-events-none drop-shadow-md">Main Building</text>
                                        </g>

                                        {/* Admin Office */}
                                        <g className="cursor-pointer group" onClick={() => scrollTo('zone-admin')}>
                                            <rect x="50" y="220" width="120" height="120" fill={ZONES[7].color} opacity="0.8" className="transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-1" rx="8" />
                                            <text x="110" y="285" textAnchor="middle" fill="white" fontWeight="bold" fontSize="18" className="pointer-events-none drop-shadow-md">Admin</text>
                                        </g>

                                        {/* Science Block */}
                                        <g className="cursor-pointer group" onClick={() => scrollTo('zone-science')}>
                                            <rect x="300" y="220" width="150" height="120" fill={ZONES[1].color} opacity="0.8" className="transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-1" rx="8" />
                                            <text x="375" y="285" textAnchor="middle" fill="white" fontWeight="bold" fontSize="20" className="pointer-events-none drop-shadow-md">Science</text>
                                        </g>

                                        {/* Library */}
                                        <g className="cursor-pointer group" onClick={() => scrollTo('zone-library')}>
                                            <rect x="580" y="50" width="180" height="180" fill={ZONES[3].color} opacity="0.8" className="transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-1" rx="8" />
                                            <text x="670" y="145" textAnchor="middle" fill="white" fontWeight="bold" fontSize="22" className="pointer-events-none drop-shadow-md">Library</text>
                                        </g>

                                        {/* Computer Lab */}
                                        <g className="cursor-pointer group" onClick={() => scrollTo('zone-computer')}>
                                            <rect x="580" y="250" width="180" height="120" fill={ZONES[2].color} opacity="0.8" className="transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-1" rx="8" />
                                            <text x="670" y="315" textAnchor="middle" fill="white" fontWeight="bold" fontSize="20" className="pointer-events-none drop-shadow-md">IT Block</text>
                                        </g>

                                        {/* Auditorium */}
                                        <g className="cursor-pointer group" onClick={() => scrollTo('zone-auditorium')}>
                                            <circle cx="880" cy="180" r="80" fill={ZONES[4].color} opacity="0.8" className="transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-1" />
                                            <text x="880" y="185" textAnchor="middle" fill="white" fontWeight="bold" fontSize="18" className="pointer-events-none drop-shadow-md">Auditorium</text>
                                        </g>

                                        {/* Sports Ground */}
                                        <g className="cursor-pointer group" onClick={() => scrollTo('zone-sports')}>
                                            <rect x="50" y="400" width="400" height="160" fill={ZONES[5].color} opacity="0.8" className="transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-1" rx="20" />
                                            <text x="250" y="485" textAnchor="middle" fill="white" fontWeight="bold" fontSize="28" className="pointer-events-none drop-shadow-md">Sports Ground</text>
                                        </g>

                                        {/* Canteen */}
                                        <g className="cursor-pointer group" onClick={() => scrollTo('zone-canteen')}>
                                            <rect x="580" y="420" width="200" height="120" fill={ZONES[6].color} opacity="0.8" className="transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-1" rx="8" />
                                            <text x="680" y="485" textAnchor="middle" fill="white" fontWeight="bold" fontSize="22" className="pointer-events-none drop-shadow-md">Canteen</text>
                                        </g>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 3. Campus Zones Gallery */}
                    <section className="py-20 bg-neutral-50 border-t border-neutral-100">
                        <div className="container px-4 max-w-6xl mx-auto flex flex-col gap-24">
                            {ZONES.map((zone, idx) => (
                                <div
                                    key={zone.id}
                                    id={zone.id}
                                    className={`flex flex-col md:flex-row gap-8 lg:gap-16 items-center scroll-mt-32 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                                >
                                    {/* Location Info */}
                                    <div className="w-full md:w-1/3 flex flex-col gap-6">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl text-white shadow-lg shrink-0 mb-2 transition-transform hover:scale-110" style={{ backgroundColor: zone.color }}>
                                            {zone.icon}
                                        </div>
                                        <h3 className="text-3xl font-playfair font-bold text-primary">{zone.name}</h3>
                                        <div className="w-12 h-1 bg-gold rounded-full"></div>
                                        <p className="text-neutral-600 text-lg leading-relaxed">{zone.desc}</p>
                                        <div className="flex gap-4 mt-2">
                                            <button onClick={() => scrollGallery(zone.id, 'left')} className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                                                <ChevronLeft className="w-6 h-6" />
                                            </button>
                                            <button onClick={() => scrollGallery(zone.id, 'right')} className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                                                <ChevronRight className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* CSS Only Carousel */}
                                    <div className="w-full md:w-2/3 relative rounded-3xl overflow-hidden bg-white shadow-2xl p-3 border border-neutral-100">
                                        <div
                                            id={`carousel-${zone.id}`}
                                            className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar rounded-2xl h-[300px] md:h-[400px] lg:h-[450px]"
                                        >
                                            {/* Slide 1 */}
                                            <div className="snap-center w-full shrink-0 relative">
                                                <img src={`https://picsum.photos/seed/${zone.seed}1/800/600`} className="w-full h-full object-cover" alt={`${zone.name} View 1`} loading="lazy" />
                                            </div>
                                            {/* Slide 2 */}
                                            <div className="snap-center w-full shrink-0 relative">
                                                <img src={`https://picsum.photos/seed/${zone.seed}2/800/600`} className="w-full h-full object-cover" alt={`${zone.name} View 2`} loading="lazy" />
                                            </div>
                                            {/* Slide 3 */}
                                            <div className="snap-center w-full shrink-0 relative">
                                                <img src={`https://picsum.photos/seed/${zone.seed}3/800/600`} className="w-full h-full object-cover" alt={`${zone.name} View 3`} loading="lazy" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>{/* end flex-1 content */}

                {/* Desktop sticky sidebar */}
                <div className="hidden xl:flex flex-col gap-3 sticky top-28 self-start z-30 shrink-0 p-4 pt-8">
                    {STATS.map((stat, idx) => (
                        <div
                            key={idx}
                            className="bg-white/90 backdrop-blur-md shadow-md border border-neutral-100 px-4 py-3 rounded-xl flex items-center gap-3"
                        >
                            <div className="w-2 h-2 rounded-full bg-gold shrink-0"></div>
                            <span className="font-bold text-sm text-primary uppercase tracking-wider whitespace-nowrap">{stat}</span>
                        </div>
                    ))}
                </div>

            </div>{/* end flex wrapper */}

            {/* 4. 360° Tour Teaser */}
            <section className="py-24 bg-primary relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute inset-0 opacity-10">
                    <svg patternUnits="userSpaceOnUse" width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="absolute w-full h-full">
                        <path d="M 0 0 L 100 0 L 100 100 L 0 100 Z" fill="none" />
                        <circle cx="50" cy="50" r="10" fill="white" />
                    </svg>
                </div>

                <div className="container relative z-10 px-4 max-w-6xl mx-auto flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-8 shadow-2xl">
                        <Video className="w-8 h-8 text-gold" />
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold font-playfair text-white mb-6">
                        Experience our campus in full 360°
                    </h2>
                    <p className="text-white/80 text-xl max-w-2xl mx-auto mb-16">
                        While a virtual gallery gives you a glimpse, nothing beats the real experience. Schedule a physical visit to feel the true heart of our community.
                    </p>

                    {/* Video Placeholder */}
                    <div className="w-full max-w-4xl aspect-video bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 relative mb-16">
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?controls=0&modestbranding=1&rel=0"
                            title="Campus Tour Placeholder"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                        ></iframe>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6">
                        <Link href="/contact" className="btn bg-gold text-primary hover:bg-white px-10 py-4 text-lg font-bold rounded-full transition-all hover:scale-105 shadow-xl hover:shadow-white/10">
                            Book a Campus Visit
                        </Link>
                        <Link href="/gallery" className="btn bg-transparent border border-white text-white hover:bg-white hover:text-primary px-10 py-4 text-lg font-bold rounded-full transition-all hover:scale-105">
                            View Photo Gallery
                        </Link>
                    </div>
                </div>
            </section>

        </main>
    );
}
