"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/icons";

interface Program {
    title: string;
    description: string;
    icon: string;
    href: string;
    color: string;
}

interface AcademicsGridProps {
    programs: Program[];
}

export function AcademicsGrid({ programs }: AcademicsGridProps) {
    if (!programs || programs.length === 0) return null;

    return (
        <section className="bg-white py-24">
            <div className="container mx-auto px-4 text-center">
                <span className="section-subheading mx-auto text-accent">Our Programs</span>
                <h2 className="text-3xl md:text-5xl font-playfair font-bold text-primary mb-16 max-w-3xl mx-auto">
                    Academic Excellence Framework
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {programs.map((level, index) => (
                        <motion.div
                            key={level.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group"
                        >
                            <Link
                                href={level.href}
                                className="h-full min-h-[320px] flex flex-col p-8 border border-gray-100 hover:border-accent hover:shadow-2xl transition-all duration-500 bg-white relative overflow-hidden rounded-xl"
                            >
                                {/* Background Accent */}
                                <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rounded-full transition-transform group-hover:scale-150 duration-500", level.color)} />

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="w-16 h-16 bg-primary text-gold flex items-center justify-center mb-8 transition-transform group-hover:bg-accent group-hover:text-white duration-300 rounded-lg shadow-lg">
                                        {getIcon(level.icon, { size: 32 })}
                                    </div>
                                    <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-accent transition-colors">
                                        {level.title}
                                    </h3>
                                    <p className="text-muted text-sm leading-relaxed mb-auto">
                                        {level.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest group-hover:gap-4 transition-all mt-6">
                                        Explore <ArrowRight className="w-4 h-4 text-accent" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
