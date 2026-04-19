"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
    Info,
    Target,
    Users,
    History,
    ChevronRight,
    LucideIcon,
    School
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AboutPageLayoutProps {
    title: string;
    subtitle: string;
    description: string;
    icon: "info" | "target" | "users" | "history" | "school";
    image?: string;
    children: React.ReactNode;
}

const ICONS = {
    info: Info,
    target: Target,
    users: Users,
    history: History,
    school: School
};

const ABOUT_NAV = [
    { name: "Overview", href: "/about/overview", icon: Info },
    { name: "Vision & Mission", href: "/about/vision", icon: Target },
    { name: "Principal's Message", href: "/about/principal", icon: Users },
    { name: "Leadership", href: "/about/leadership", icon: Users },
    { name: "History & Legacy", href: "/about/history", icon: History },
];

export function AboutPageLayout({
    title,
    subtitle,
    description,
    icon,
    image = "https://images.unsplash.com/photo-1523050853063-91503ff44c06?q=80&w=2000",
    children,
}: AboutPageLayoutProps) {
    const pathname = usePathname();
    const PageIcon = ICONS[icon] || Info;

    return (
        <div className="min-h-screen bg-surface">
            {/* Hero Section */}
            <section
                data-hero-dark="true"
                className="relative h-[450px] flex items-center bg-primary overflow-hidden pt-32 pb-16"
            >
                <div className="container relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <div className="flex items-center gap-3 text-gold mb-4">
                            <PageIcon className="w-8 h-8" />
                            <span className="text-sm font-bold tracking-[0.3em] uppercase">{subtitle}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6 leading-tight">
                            {title}
                        </h1>
                        <p className="text-xl text-white/70 font-inter leading-relaxed max-w-2xl">
                            {description}
                        </p>
                    </motion.div>
                </div>

                {/* Abstract Background Design */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] -ml-24 -mb-24 pointer-events-none" />
            </section>

            <div className="container py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1 sticky top-28">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <h3 className="text-lg font-playfair font-bold text-primary mb-8 border-b border-gray-100 pb-4">
                                About Our School
                            </h3>
                            <nav className="space-y-3">
                                {ABOUT_NAV.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center justify-between group p-4 rounded-2xl transition-all duration-300",
                                                isActive
                                                    ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                                                    : "hover:bg-surface text-gray-600 hover:text-primary"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <Icon className={cn(
                                                    "w-5 h-5 transition-colors",
                                                    isActive ? "text-gold" : "text-gray-400 group-hover:text-primary"
                                                )} />
                                                <span className="text-sm font-bold tracking-wide">{item.name}</span>
                                            </div>
                                            <ChevronRight className={cn(
                                                "w-4 h-4 transition-transform group-hover:translate-x-1",
                                                isActive ? "text-gold" : "text-gray-300"
                                            )} />
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* Trust Badge */}
                            <div className="mt-12 p-6 bg-surface rounded-2xl border border-gray-100 italic transition-hover hover:border-gold/30">
                                <p className="text-sm text-primary/60 leading-relaxed font-playfair">
                                    "Educating the mind without educating the heart is no education at all."
                                </p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gold mt-4">— Aristotle</p>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-4xl shadow-sm border border-gray-100 p-8 md:p-16 min-h-[600px]"
                        >
                            {children}
                        </motion.div>
                    </main>
                </div>
            </div>
        </div>
    );
}
