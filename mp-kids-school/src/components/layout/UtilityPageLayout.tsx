"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Network, ShieldAlert, Info } from "lucide-react";

interface UtilityPageLayoutProps {
    title: string;
    subtitle: string;
    description: string;
    icon: "file-text" | "sitemap" | "shield" | "info";
    children: React.ReactNode;
}

const ICONS = {
    "file-text": FileText,
    sitemap: Network,
    shield: ShieldAlert,
    info: Info
};

export function UtilityPageLayout({
    title,
    subtitle,
    description,
    icon,
    children,
}: UtilityPageLayoutProps) {
    const PageIcon = ICONS[icon] || Info;
    return (
        <div className="min-h-screen bg-surface">
            {/* Hero Section */}
            <section
                data-hero-dark="true"
                className="relative h-[400px] flex items-center bg-primary overflow-hidden pt-32 pb-16"
            >
                <div className="container relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <div className="flex items-center justify-center gap-3 text-gold mb-4">
                            <PageIcon className="w-8 h-8" />
                            <span className="text-sm font-bold tracking-[0.3em] uppercase">{subtitle}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6 leading-tight">
                            {title}
                        </h1>
                        <p className="text-xl text-white/70 font-inter leading-relaxed mx-auto max-w-2xl">
                            {description}
                        </p>
                    </motion.div>
                </div>

                {/* Abstract Background Design */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] -ml-24 -mb-24 pointer-events-none" />
            </section>

            {/* Main Content */}
            <div className="container py-20">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-4xl shadow-sm border border-gray-100 p-8 md:p-16 prose prose-slate max-w-none"
                    >
                        {children}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
