"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
    ChevronRight,
    Monitor,
    Beaker,
    Cpu,
    Library,
    Trophy,
    Bus,
    LucideIcon,
    Building2
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface FacilityPageLayoutProps {
    title: string;
    subtitle: string;
    description: string;
    icon: "monitor" | "beaker" | "cpu" | "library" | "trophy" | "bus" | "building";
    image: string;
    children: React.ReactNode;
}

const ICONS = {
    monitor: Monitor,
    beaker: Beaker,
    cpu: Cpu,
    library: Library,
    trophy: Trophy,
    bus: Bus,
    building: Building2
};

const FACILITIES_NAV = [
    { name: "Smart Classrooms", href: "/facilities/classrooms", icon: Monitor },
    { name: "Science Labs", href: "/facilities/science-labs", icon: Beaker },
    { name: "Computer Lab", href: "/facilities/computer-lab", icon: Cpu },
    { name: "Library", href: "/facilities/library", icon: Library },
    { name: "Sports Facilities", href: "/facilities/sports", icon: Trophy },
    { name: "Transportation", href: "/facilities/transport", icon: Bus },
];

export function FacilityPageLayout({
    title,
    subtitle,
    description,
    icon,
    image,
    children,
}: FacilityPageLayoutProps) {
    const pathname = usePathname();
    const PageIcon = ICONS[icon] || Monitor;

    return (
        <div className="min-h-screen bg-surface">
            {/* Hero Section */}
            <section
                data-hero-dark="true"
                className="relative h-[400px] flex items-center bg-primary overflow-hidden pt-32 pb-16"
            >
                <div className="absolute inset-0 z-0">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-linear-to-b from-primary/20 via-transparent to-primary/40" />
                </div>

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
                        <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6">
                            {title}
                        </h1>
                        <p className="text-xl text-white/80 font-inter leading-relaxed max-w-2xl">
                            {description}
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="container py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-28">
                            <h3 className="text-lg font-playfair font-bold text-primary mb-6 flex items-center gap-2">
                                <Monitor className="w-5 h-5 text-accent" />
                                Our Facilities
                            </h3>
                            <nav className="space-y-2">
                                {FACILITIES_NAV.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center justify-between group p-3 rounded-lg transition-all",
                                                isActive
                                                    ? "bg-primary text-white shadow-md shadow-primary/20"
                                                    : "hover:bg-surface text-text hover:text-primary"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className={cn(
                                                    "w-4 h-4 transition-colors",
                                                    isActive ? "text-gold" : "text-primary/40 group-hover:text-primary"
                                                )} />
                                                <span className="text-sm font-medium">{item.name}</span>
                                            </div>
                                            <ChevronRight className={cn(
                                                "w-4 h-4 transition-transform group-hover:translate-x-1",
                                                isActive ? "text-gold" : "text-gray-300"
                                            )} />
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* CTA Box */}
                            <div className="mt-8 bg-linear-to-br from-primary to-accent rounded-xl p-6 text-white shadow-lg shadow-primary/20">
                                <h4 className="font-playfair font-bold mb-2">Facility Tours</h4>
                                <p className="text-xs text-white/80 mb-4 leading-relaxed">
                                    Visit our campus to see our state-of-the-art infrastructure firsthand.
                                </p>
                                <Link href="/contact" className="btn btn-secondary w-full text-[10px] py-2">
                                    Book a Visit
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 min-h-[600px]">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
