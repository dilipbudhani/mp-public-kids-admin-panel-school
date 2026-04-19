"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { LucideIcon, ChevronRight, GraduationCap, Microscope, Book, Pencil, Star } from "lucide-react";

interface AcademicPageLayoutProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    heroImage: string;
}

const WINGS: { name: string; href: string; icon: LucideIcon }[] = [
    { name: "Pre-Primary", href: "/academics/pre-primary", icon: Pencil },
    { name: "Primary", href: "/academics/primary", icon: Book },
    { name: "Middle School", href: "/academics/middle", icon: Microscope },
    { name: "Secondary", href: "/academics/secondary", icon: GraduationCap },
    { name: "Senior Secondary", href: "/academics/senior-secondary", icon: Star },
];

export function AcademicPageLayout({ title, subtitle, icon, children, heroImage }: AcademicPageLayoutProps) {
    const pathname = usePathname();

    return (
        <main className="min-h-screen bg-surface">
            {/* Sub-Header / Hero */}
            <section
                data-hero-dark="true"
                className="relative h-[450px] flex items-center overflow-hidden bg-primary pt-32 pb-16"
            >
                <div className="absolute inset-0 z-0 opacity-40">
                    <div className="absolute inset-0 bg-linear-to-b from-primary/80 to-primary" />
                    {/* Fallback pattern if image is missing */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                </div>

                <div className="container relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 mb-4 text-gold"
                    >
                        {icon}
                        <span className="uppercase tracking-widest text-sm font-bold">Academics</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white text-4xl md:text-6xl mb-4 font-playfair"
                    >
                        {title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/70 text-lg max-w-2xl"
                    >
                        {subtitle}
                    </motion.p>
                </div>
            </section>

            {/* Navigation & Content Wrapper */}
            <section className="py-12 bg-surface">
                <div className="container">
                    <div className="flex flex-col lg:flex-row gap-12">

                        {/* Sidebar Navigation */}
                        <aside className="lg:w-1/4">
                            <div className="sticky top-32 space-y-8">
                                <div className="card p-0 overflow-hidden">
                                    <div className="bg-primary p-6">
                                        <h3 className="text-white text-lg font-bold">Academic Wings</h3>
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                        {WINGS.map((wing) => {
                                            const isActive = pathname === wing.href;
                                            const Icon = wing.icon;
                                            return (
                                                <Link
                                                    key={wing.href}
                                                    href={wing.href}
                                                    className={cn(
                                                        "flex items-center justify-between p-4 transition-all group",
                                                        isActive ? "bg-primary text-white" : "text-text hover:bg-gray-50"
                                                    )}
                                                >
                                                    <span className="flex items-center gap-3 font-medium">
                                                        <Icon size={18} className={cn(isActive ? "text-gold" : "text-primary/40 group-hover:text-primary")} />
                                                        {wing.name}
                                                    </span>
                                                    <ChevronRight className={cn("w-4 h-4 transition-transform", isActive ? "text-gold translate-x-1" : "group-hover:translate-x-1")} />
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Quick Contact CTA */}
                                <div className="bg-linear-to-br from-primary to-accent p-6 rounded-xl text-white shadow-lg shadow-primary/20">
                                    <h4 className="font-playfair font-bold mb-2">Have Questions?</h4>
                                    <p className="text-sm text-white/80 mb-4 leading-relaxed">Contact our admissions helpdesk for detailed subject information.</p>
                                    <Link href="/contact" className="btn btn-secondary w-full text-[10px] py-2">
                                        Enquire Now
                                    </Link>
                                </div>
                            </div>
                        </aside>

                        {/* Page Content */}
                        <div className="lg:w-3/4">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white p-8 md:p-12 shadow-subtle border border-gray-100 rounded-xl"
                            >
                                {children}
                            </motion.div>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}
