"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Star,
    Quote,
    Play,
    X,
    ChevronLeft,
    ChevronRight,
    Send,
    Users,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Counter from "@/components/ui/Counter";

interface TestimonialData {
    _id: string;
    name: string;
    role: string;
    content: string;
    rating: number;
    avatarUrl?: string;
    isActive: boolean;
}

interface TestimonialsClientProps {
    initialTestimonials: TestimonialData[];
    pageData?: any;
}

const VIDEO_TESTIMONIALS = [
    { id: "video1", name: "The Sharma Family", videoId: "dQw4w9WgXcQ" },
    { id: "video2", name: "Alumni Success Story", videoId: "dQw4w9WgXcQ" },
    { id: "video3", name: "A Day at MPPS", videoId: "dQw4w9WgXcQ" }
];

function StarRating({ rating, className = "w-4 h-4" }: { rating: number, className?: string }) {
    return (
        <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={cn(
                        className,
                        i < Math.floor(rating) ? "fill-gold text-gold" : "text-gray-300",
                        i === Math.floor(rating) && rating % 1 !== 0 && "fill-gold/50 text-gold"
                    )}
                />
            ))}
        </div>
    );
}

function FeaturedCarousel({ testimonials }: { testimonials: TestimonialData[] }) {
    const [index, setIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (isHovered || testimonials.length <= 1) return;
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [isHovered, testimonials.length]);

    if (testimonials.length === 0) return null;

    const current = testimonials[index];
    const initials = current.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    // Derived colors
    const COLORS = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-orange-500", "bg-pink-500", "bg-cyan-500"];
    const bgColor = COLORS[index % COLORS.length];

    return (
        <div
            className="relative bg-white rounded-3xl shadow-2xl overflow-hidden group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="absolute top-8 left-8 text-primary/10">
                <Quote className="w-24 h-24 rotate-180" />
            </div>

            <div className="relative z-10 px-8 py-16 lg:p-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current._id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center text-center max-w-3xl mx-auto"
                    >
                        <StarRating rating={current.rating} className="w-6 h-6 mb-8" />

                        <p className="text-xl lg:text-2xl font-medium text-primary leading-relaxed mb-10 italic">
                            &quot;{current.content}&quot;
                        </p>

                        <div className="flex flex-col items-center">
                            <div className={cn(
                                "w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg",
                                bgColor
                            )}>
                                {initials}
                            </div>
                            <h4 className="text-lg font-bold text-primary tracking-tight">
                                {current.name}
                            </h4>
                            <p className="text-accent font-medium text-sm">
                                {current.role}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls */}
            {testimonials.length > 1 && (
                <>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                className={cn(
                                    "h-1.5 rounded-full transition-all duration-300",
                                    index === i ? "w-8 bg-accent" : "w-3 bg-gray-200 hover:bg-gray-300"
                                )}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-surface text-primary opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => setIndex((prev) => (prev + 1) % testimonials.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-surface text-primary opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </>
            )}
        </div>
    );
}

function VideoModal({ videoId, onClose }: { videoId: string, onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 lg:p-10">
            <button onClick={onClose} className="absolute top-6 right-6 text-white hover:text-gold transition-colors">
                <X className="w-8 h-8" />
            </button>
            <div className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                />
            </div>
        </div>
    );
}

export default function TestimonialsClient({ initialTestimonials, pageData }: TestimonialsClientProps) {
    const [activeVideo, setActiveVideo] = useState<string | null>(null);
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const [formData, setFormData] = useState({
        name: "",
        relation: "Parent",
        classBatch: "",
        message: "",
        rating: 5
    });

    // Rating stats
    const totalCount = initialTestimonials.length;
    const avgRating = totalCount > 0
        ? Math.round((initialTestimonials.reduce((acc, t) => acc + t.rating, 0) / totalCount) * 10) / 10
        : 5.0;

    const breakdown = [5, 4, 3, 2, 1].map(stars => {
        const count = initialTestimonials.filter(t => Math.floor(t.rating) === stars).length;
        return {
            stars,
            percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0
        };
    });

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('submitting');

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: "no-email@provided.com", // Stub for lead model
                    phone: "0000000000",          // Stub for lead model
                    enquiryType: "testimonial",
                    message: `${formData.relation} (${formData.classBatch}): ${formData.message} [Rating: ${formData.rating}]`,
                    source: "testimonial-page"
                })
            });

            if (response.ok) {
                setFormStatus('success');
                setFormData({ name: "", relation: "Parent", classBatch: "", message: "", rating: 5 });
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
            setFormStatus('idle');
        }
    };

    const heroData = {
        title: pageData?.title || "What Parents & Students Say",
        subtitle: pageData?.subtitle || "Voices of Excellence",
        description: pageData?.description || "Real experiences from our school family.",
        bannerImage: pageData?.bannerImage || null
    };

    return (
        <main className="min-h-screen pt-20">
            {/* Hero Section */}
            <section
                data-hero-dark="true"
                className="relative py-24 lg:py-32 bg-primary overflow-hidden"
            >
                {heroData.bannerImage && (
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={heroData.bannerImage}
                            alt={heroData.title}
                            fill
                            className="object-cover opacity-40"
                            priority
                        />
                        <div className="absolute inset-0 bg-linear-to-b from-primary/80 via-primary/60 to-primary/90" />
                    </div>
                )}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 blur-[120px] rounded-full" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/10 blur-[120px] rounded-full" />
                </div>
                <div className="container relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        <h1 className="text-4xl lg:text-7xl font-bold font-playfair text-white mb-6 whitespace-pre-line">
                            {heroData.title}
                        </h1>
                        <p className="text-xl text-white/70 font-medium">
                            {heroData.description}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Featured Carousel Section */}
            <section className="py-20 bg-surface">
                <div className="container">
                    <div className="mb-12 text-center">
                        <span className="text-accent font-bold tracking-widest uppercase text-sm">Voices of Excellence</span>
                        <h2 className="text-3xl lg:text-4xl font-bold font-playfair text-primary mt-2">Personal Stories</h2>
                    </div>
                    <FeaturedCarousel testimonials={initialTestimonials.slice(0, 6)} />
                </div>
            </section>

            {/* Overall Rating Section */}
            <section className="py-20">
                <div className="container">
                    <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100 flex flex-col lg:flex-row items-center gap-12">
                        <div className="text-center lg:text-left lg:border-r border-gray-100 lg:pr-12">
                            <h3 className="text-5xl lg:text-6xl font-bold text-primary mb-2">{avgRating}/5</h3>
                            <div className="flex justify-center lg:justify-start mb-4">
                                <StarRating rating={avgRating} className="w-6 h-6" />
                            </div>
                            <p className="text-text/60 font-medium flex items-center justify-center lg:justify-start gap-2">
                                <Users className="w-4 h-4" /> {totalCount || 200}+ Reviews
                            </p>
                        </div>
                        <div className="flex-1 w-full space-y-4">
                            {breakdown.map((item) => (
                                <div key={item.stars} className="flex items-center gap-4">
                                    <span className="text-sm font-bold text-primary min-w-[40px]">{item.stars} ★</span>
                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${item.percentage}%` }}
                                            className="h-full bg-gold"
                                        />
                                    </div>
                                    <span className="text-xs font-medium text-text/40 min-w-[35px]">{item.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Reviews Grid */}
            <section className="py-20 bg-surface">
                <div className="container">
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold font-playfair text-primary">Voice of the Community</h2>
                        <p className="text-text/60 mt-2">Insights from our students and parents.</p>
                    </div>
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {initialTestimonials.map((review, i) => (
                            <motion.div
                                key={review._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className={cn(
                                    "break-inside-avoid bg-white p-6 rounded-2xl shadow-sm border-l-4",
                                    ["border-blue-500", "border-purple-500", "border-emerald-500", "border-orange-500", "border-red-500"][i % 5]
                                )}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-primary text-sm uppercase tracking-tight">{review.name}</h4>
                                        <p className="text-[10px] text-accent font-bold">{review.role.toUpperCase()}</p>
                                    </div>
                                    <StarRating rating={review.rating} className="w-3 h-3" />
                                </div>
                                <p className="text-text/80 text-sm leading-relaxed italic">
                                    &quot;{review.content}&quot;
                                </p>
                            </motion.div>
                        ))}

                        {initialTestimonials.length === 0 && (
                            <div className="text-center py-12 text-gray-400 italic">
                                No testimonials published yet.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Video Testimonials Section */}
            <section className="py-20">
                <div className="container">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-5xl font-bold font-playfair text-primary underline decoration-gold/30 underline-offset-8">Watch Their Stories</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {VIDEO_TESTIMONIALS.map((video) => (
                            <motion.div
                                key={video.id}
                                whileHover={{ y: -10 }}
                                className="group cursor-pointer"
                                onClick={() => setActiveVideo(video.videoId)}
                            >
                                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl">
                                    <Image
                                        src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
                                        alt={video.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-accent transition-all duration-300">
                                            <Play className="w-8 h-8 text-white fill-white ml-1" />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-between items-center px-2">
                                    <h4 className="font-bold text-primary text-lg">{video.name}</h4>
                                    <ChevronRight className="w-5 h-5 text-accent" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Video Modal */}
            <AnimatePresence>
                {activeVideo && (
                    <VideoModal videoId={activeVideo} onClose={() => setActiveVideo(null)} />
                )}
            </AnimatePresence>

            {/* Testimonial Form */}
            <section className="py-24 bg-primary text-white">
                <div className="container">
                    <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-lg rounded-[3rem] p-8 lg:p-16 border border-white/10">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl lg:text-4xl font-bold font-playfair mb-4">Share Your Experience</h2>
                            <p className="text-white/60">Your feedback helps us shine brighter.</p>
                        </div>

                        {formStatus === 'success' ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Thank you!</h3>
                                <p className="text-white/60 mb-8">Your review has been submitted for moderation.</p>
                                <button onClick={() => setFormStatus('idle')} className="btn btn-secondary px-8">Submit Another</button>
                            </div>
                        ) : (
                            <form onSubmit={handleFormSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-wider text-white/40">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-colors"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-wider text-white/40">Role</label>
                                        <select
                                            className="w-full bg-primary border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-colors appearance-none"
                                            value={formData.relation}
                                            onChange={e => setFormData({ ...formData, relation: e.target.value })}
                                        >
                                            <option>Parent</option>
                                            <option>Student</option>
                                            <option>Alumni</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-white/40">Class / Batch</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Class X (2023)"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-colors"
                                        value={formData.classBatch}
                                        onChange={e => setFormData({ ...formData, classBatch: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-white/40">Your Message</label>
                                    <textarea
                                        required
                                        rows={4}
                                        placeholder="Tell us about your journey at MPPS..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-colors resize-none"
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-4">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-bold uppercase tracking-wider text-white/40">Rating:</span>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, rating: s })}
                                                >
                                                    <Star className={cn("w-6 h-6", s <= formData.rating ? "text-gold fill-gold" : "text-white/10")} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        disabled={formStatus === 'submitting'}
                                        type="submit"
                                        className="btn btn-secondary w-full md:w-auto px-12 h-14 gap-2"
                                    >
                                        {formStatus === 'submitting' ? 'Submitting...' : <><Send className="w-4 h-4" /> Share My Voice</>}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
