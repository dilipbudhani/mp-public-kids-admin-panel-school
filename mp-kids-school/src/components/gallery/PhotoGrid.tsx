'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const photos = [
    { url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800', category: 'Campus' },
    { url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800', category: 'Events' },
    { url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800', category: 'Classroom' },
    { url: 'https://images.unsplash.com/photo-1523050335392-93851179ae22?auto=format&fit=crop&q=80&w=800', category: 'Sports' },
    { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800', category: 'Community' },
    { url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800', category: 'Library' },
];

export default function PhotoGrid() {
    return (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {photos.map((photo, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="relative group rounded-3xl overflow-hidden break-inside-avoid shadow-lg"
                >
                    <Image
                        src={photo.url}
                        alt="School Life"
                        width={800}
                        height={600}
                        className="w-full object-cover grayscale-0 hover:grayscale transition-all duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-linear-to-t from-black/80 to-transparent translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                        <span className="text-secondary font-bold text-xs uppercase tracking-tighter">{photo.category}</span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
