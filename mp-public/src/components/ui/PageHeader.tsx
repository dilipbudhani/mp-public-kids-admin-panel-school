"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
    label: string;
    href: string;
    active?: boolean;
}

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumb?: BreadcrumbItem[];
    dark?: boolean;
}

const PageHeader = ({ title, description, breadcrumb, dark = false }: PageHeaderProps) => {
    return (
        <section className={cn(
            "relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden",
            dark ? "bg-slate-900 text-white" : "bg-white text-slate-900"
        )}
            data-hero-dark={dark ? "true" : "false"}
        >
            {/* Background Ornaments */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl">
                    {/* Breadcrumbs */}
                    {breadcrumb && (
                        <motion.nav
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-2 mb-8"
                        >
                            {breadcrumb.map((item, idx) => (
                                <React.Fragment key={idx}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "text-sm font-bold tracking-widest uppercase transition-colors hover:text-primary",
                                            item.active ? "text-primary cursor-default" : dark ? "text-slate-400" : "text-slate-500"
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                    {idx < breadcrumb.length - 1 && (
                                        <ChevronRight className={cn("w-4 h-4", dark ? "text-slate-700" : "text-slate-200")} />
                                    )}
                                </React.Fragment>
                            ))}
                        </motion.nav>
                    )}

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black font-playfair mb-8 leading-[1.1]"
                    >
                        {title}
                        {dark && <span className="block h-2 w-24 bg-primary mt-6 rounded-full" />}
                    </motion.h1>

                    {/* Description */}
                    {description && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className={cn(
                                "text-lg md:text-xl leading-relaxed max-w-2xl font-medium",
                                dark ? "text-slate-400" : "text-slate-500"
                            )}
                        >
                            {description}
                        </motion.p>
                    )}
                </div>
            </div>

            {/* Bottom Curve/Texture */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent" />
        </section>
    );
};

export default PageHeader;
