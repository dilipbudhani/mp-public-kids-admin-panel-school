'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface TimelineItem {
    year: string;
    event: string;
    description: string;
}

interface SchoolHistoryProps {
    timeline?: TimelineItem[];
    legacyImage?: string;
    legacyText?: string;
}

const DEFAULT_TIMELINE = [
    {
        year: '1995',
        event: 'Founding Stone Laid',
        description: 'MP Public School was established with a small cohort of 50 students and a vision for holistic growth.',
    },
    {
        year: '2005',
        event: 'CBSE Secondary Affiliation',
        description: 'Received formal affiliation from CBSE for secondary classes, marking our first decade of excellence.',
    },
    {
        year: '2012',
        event: 'Senior Secondary Expansion',
        description: 'Inaugurated the senior secondary block with Science and Commerce streams.',
    },
    {
        year: '2020',
        event: 'Silver Jubilee & Tech Integration',
        description: 'Celebrated 25 years with a complete digital transformation of classrooms and labs.',
    },
    {
        year: '2025',
        event: 'New Modern Campus Wing',
        description: 'Opening of the state-of-the-art Research and Arts center to cater to 21st-century skills.',
    },
];

export default function SchoolHistory({
    timeline = DEFAULT_TIMELINE,
    legacyImage = "https://images.unsplash.com/photo-1523050853063-91503ff44c06?q=80&w=2000",
    legacyText = "A Tradition of Excellence Since 1995"
}: SchoolHistoryProps) {
    return (
        <section className="py-24 bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    {/* Legacy Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/2 relative group"
                    >
                        <div className="relative h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src={legacyImage}
                                alt="Our Legacy"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-accent/20" />
                        </div>
                        {/* Decorative Overlay */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-2xl" />
                    </motion.div>

                    {/* Timeline */}
                    <div className="w-full lg:w-1/2">
                        <span className="text-primary font-bold tracking-widest text-sm uppercase mb-4 inline-block">
                            Our Journey
                        </span >
                        <h2 className="text-4xl md:text-5xl font-serif text-accent font-bold mb-12">
                            {legacyText}
                        </h2>

                        <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-8 before:w-0.5 before:bg-slate-200">
                            {timeline.map((item, index) => (
                                <motion.div
                                    key={item.year}
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative pl-20 group"
                                >
                                    <div className="absolute left-0 top-0 w-16 h-16 bg-white border-2 border-slate-200 flex items-center justify-center rounded-2xl group-hover:border-secondary group-hover:bg-secondary group-hover:text-accent transition-all z-10 font-serif font-bold text-slate-400">
                                        {item.year}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-accent mb-2">{item.event}</h3>
                                        <p className="text-slate-600 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
