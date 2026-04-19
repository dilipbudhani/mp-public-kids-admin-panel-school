'use client';

import { motion } from 'framer-motion';
import { Target, Eye, Heart, LucideIcon } from 'lucide-react';

interface CoreValue {
    title: string;
    description: string;
    icon?: string; // Icon name as string
    color?: string;
}

interface VisionMissionProps {
    values?: CoreValue[];
}

const ICON_MAP: Record<string, LucideIcon> = {
    'Eye': Eye,
    'Target': Target,
    'Heart': Heart,
};

const DEFAULT_VALUES = [
    {
        title: 'Our Vision',
        description: 'To be a global leader in education, fostering an environment where innovation, character, and academic excellence converge to shape future leaders.',
        icon: 'Eye',
        color: 'bg-primary',
    },
    {
        title: 'Our Mission',
        description: 'To provide a holistic CBSE-aligned education that empowers students with critical thinking, ethical values, and a lifelong passion for learning.',
        icon: 'Target',
        color: 'bg-accent',
    },
    {
        title: 'Our Philosophy',
        description: 'We believe in the unique potential of every child. Our student-centric approach ensures personal growth alongside academic success.',
        icon: 'Heart',
        color: 'bg-secondary',
    },
];

export default function VisionMission({ values = DEFAULT_VALUES }: VisionMissionProps) {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {values.map((value, index) => {
                        const Icon = ICON_MAP[value.icon || 'Target'] || Target;
                        return (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex flex-col items-center text-center p-10 rounded-3xl border border-slate-100 hover:shadow-2xl transition-all group"
                            >
                                <div className={`w-20 h-20 ${value.color || 'bg-primary'} text-white rounded-2xl flex items-center justify-center mb-8 rotate-3 group-hover:rotate-0 transition-transform shadow-lg`}>
                                    <Icon size={40} />
                                </div>
                                <h3 className="text-2xl font-serif text-accent font-bold mb-6 italic">{value.title}</h3>
                                <p className="text-slate-600 leading-relaxed text-lg">
                                    {value.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
