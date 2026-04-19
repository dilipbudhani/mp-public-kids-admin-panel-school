'use client';

import { motion } from 'framer-motion';
import { Mail, Linkedin, Twitter } from 'lucide-react';
import Image from 'next/image';

interface Leader {
    name: string;
    role: string;
    bio?: string;
    image?: string;
}

interface LeadershipGalleryProps {
    leaders?: Leader[];
}

const DEFAULT_LEADERS = [
    {
        name: 'Dr. Vikram Malhotra',
        role: 'Founder & Chairman',
        bio: 'An educationist with 40 years of experience in transformative learning paradigms.',
        image: '/images/leadership/chairman.png',
    },
    {
        name: 'Ms. Priya Sharma',
        role: 'Director',
        bio: 'At MP Kids School, our vision is to create a global community of lifelong learners.',
        image: '/images/leadership/director.png',
    },
    {
        name: 'Dr. Rajesh Sharma',
        role: 'Principal',
        bio: 'Dedicated to fostering a culture of academic rigor and emotional intelligence.',
        image: '/images/leadership/principal.png',
    },
];

export default function LeadershipGallery({ leaders = DEFAULT_LEADERS }: LeadershipGalleryProps) {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-primary font-bold tracking-widest text-sm uppercase mb-4 inline-block">
                        Visionary Leadership
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif text-accent font-bold mb-6">
                        The Minds Behind Excellence
                    </h2>
                    <p className="text-slate-600 text-lg">
                        Our leadership team brings together decades of expertise in academic administration, pedagogy, and student development.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {leaders.map((person, index) => (
                        <motion.div
                            key={person.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="relative h-[450px] overflow-hidden rounded-3xl mb-8 shadow-xl bg-slate-100">
                                {person.image ? (
                                    <Image
                                        src={person.image}
                                        alt={person.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-slate-200" />
                                )}
                                <div className="absolute inset-0 bg-linear-to-t from-accent/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex flex-col justify-end p-8">
                                    <div className="flex gap-4">
                                        <Linkedin size={20} className="text-white hover:text-secondary cursor-pointer" />
                                        <Twitter size={20} className="text-white hover:text-secondary cursor-pointer" />
                                        <Mail size={20} className="text-white hover:text-secondary cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-accent mb-1">{person.name}</h3>
                            <p className="text-primary font-bold text-sm uppercase tracking-widest mb-4">
                                {person.role}
                            </p>
                            <p className="text-slate-600 line-clamp-3">
                                {person.bio}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
