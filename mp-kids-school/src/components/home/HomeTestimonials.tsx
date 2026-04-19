'use client';

import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

interface Testimonial {
    _id: string;
    name: string;
    role: string;
    content: string;
    rating?: number;
    avatarUrl?: string;
}

interface HomeTestimonialsProps {
    testimonials: Testimonial[];
}

export default function HomeTestimonials({ testimonials }: HomeTestimonialsProps) {
    if (!testimonials || testimonials.length === 0) return null;

    return (
        <section className="py-24 bg-accent text-white overflow-hidden relative">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -mr-48 -mt-48 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full -ml-48 -mb-48 blur-3xl" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col items-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="text-secondary font-bold tracking-widest text-sm uppercase mb-4"
                    >
                        Voice of Parents & Alumni
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-serif text-center font-bold mb-6"
                    >
                        The Legacy of Excellence
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl relative"
                        >
                            <div className="absolute -top-4 -right-4 bg-secondary p-3 rounded-2xl shadow-lg">
                                <Quote className="text-accent" size={24} />
                            </div>

                            <div className="flex gap-1 mb-6 text-secondary">
                                {[...Array(item.rating || 5)].map((_, i) => (
                                    <Star key={i} size={16} fill="currentColor" stroke="none" />
                                ))}
                            </div>

                            <p className="text-lg italic text-white/90 mb-8 leading-relaxed">
                                "{item.content}"
                            </p>

                            <div>
                                <h4 className="text-xl font-bold text-white">{item.name}</h4>
                                <p className="text-secondary text-sm font-medium">{item.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
