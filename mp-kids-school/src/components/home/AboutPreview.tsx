"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface AboutPreviewProps {
    data?: {
        title: string;
        subtitle?: string;
        content: string;
        image?: string;
        features?: string[];
    };
}

export function AboutPreview({ data }: AboutPreviewProps) {
    const title = data?.title || "Nurturing Excellence, Inspiring Innovation";
    const subtitle = data?.subtitle || "Our Legacy";
    const content = data?.content || "For over 25 years, MP Kids School has been at the forefront of quality education. We combine traditional values with modern methodology to create a learning environment that is both rigorous and supportive.";
    const image = data?.image || "/images/about-preview.png";
    const features = data?.features || [
        "CBSE Excellence Curriculum",
        "State-of-the-art Labs",
        "Eco-friendly Campus",
        "Global Exchange Programs"
    ];

    return (
        <section className="bg-surface py-20 lg:py-24">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    {/* Left: Image Container */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2 relative"
                    >
                        <div className="relative aspect-4/3 overflow-hidden rounded-2xl shadow-2xl">
                            <Image
                                src={image}
                                alt={title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold/10 -z-10 rounded-full blur-2xl" />
                        <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-accent/20 -z-10 rounded-2xl" />
                    </motion.div>

                    {/* Right: Content Container */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2"
                    >
                        <span className="section-subheading text-accent font-semibold tracking-widest uppercase mb-4 block">
                            {subtitle}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-playfair font-bold text-primary mb-6 leading-tight">
                            {title}
                        </h2>
                        <p className="text-muted text-lg mb-8 leading-relaxed">
                            {content}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mb-10">
                            {features.map((feature, i) => (
                                <FeatureItem key={i} text={feature} />
                            ))}
                        </div>

                        <Link href="/about/overview" className="btn btn-primary group inline-flex items-center bg-primary text-white px-8 py-4 rounded-lg font-bold hover:shadow-xl transition-all">
                            Learn More About Us
                            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function FeatureItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
            <span className="text-sm font-bold text-primary uppercase tracking-wide">{text}</span>
        </div>
    );
}
