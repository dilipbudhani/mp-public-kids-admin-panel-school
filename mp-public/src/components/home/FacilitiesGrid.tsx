'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { getIcon } from "@/lib/icons";

interface Facility {
    title: string;
    description: string;
    icon: string;
    image: string;
}

interface FacilitiesGridProps {
    facilities: Facility[];
}

export default function FacilitiesGrid({ facilities }: FacilitiesGridProps) {
    if (!facilities || facilities.length === 0) return null;

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center mb-16">
                    <span className="section-subheading-gold mx-auto text-gold uppercase tracking-[0.3em] font-bold text-sm mb-4">Infrastructure</span>
                    <h2 className="text-3xl md:text-5xl font-playfair font-bold text-primary mb-6 text-center">
                        World-Class Facilities
                    </h2>
                    <div className="w-24 h-1 bg-secondary rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {facilities.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative h-[400px] overflow-hidden rounded-2xl shadow-xl bg-primary"
                        >
                            {/* Background Image with Zoom Hook */}
                            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                                <div className="absolute inset-0 bg-primary/60 group-hover:bg-primary/40 transition-colors z-10" />
                                {item.image ? (
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-400">
                                        <span className="font-playfair italic text-lg opacity-50">{item.title}</span>
                                    </div>
                                )}
                            </div>

                            {/* Content Overlay */}
                            <div className="absolute inset-x-0 bottom-0 p-8 z-20 translate-y-0 lg:translate-y-6 lg:group-hover:translate-y-0 transition-transform duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-secondary text-primary rounded-lg shadow-lg">
                                        {getIcon(item.icon, { size: 24 })}
                                    </div>
                                    <h3 className="text-2xl font-playfair text-white font-bold">{item.title}</h3>
                                </div>
                                <p className="text-white/80 line-clamp-2 mb-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                                    {item.description}
                                </p>
                                <button className="text-secondary font-bold inline-flex items-center gap-2 group/btn">
                                    Learn More
                                    <span className="w-6 h-[2px] bg-secondary group-hover/btn:w-10 transition-all" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
