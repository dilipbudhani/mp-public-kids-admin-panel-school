import React from 'react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Download
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { dbConnect } from "@/lib/mongodb";
import StaticPage from "@/models/StaticPage";
import SectionRenderer from "@/components/site/SectionRenderer";



export default async function AdmissionsPage() {
    await dbConnect();
    const pageData = await StaticPage.findOne({ slug: "admissions", schoolIds: process.env.SCHOOL_ID }).lean();

    const banner = {
        title: pageData?.title || "Join the Excellence Family",
        description: pageData?.description || "Experience a world-class education that shapes minds and builds futures. Admissions open for session 2026-27.",
        image: pageData?.bannerImage || "https://images.unsplash.com/photo-1523050853064-85a92790642f?q=80&w=2070&auto=format&fit=crop"
    };

    return (
        <main className="flex flex-col">
            {/* Header */}
            <section
                data-hero-dark="true"
                className="relative h-[450px] flex items-center bg-primary overflow-hidden pt-32"
            >
                <div className="absolute inset-0 z-0">
                    <Image
                        src={banner.image}
                        alt="Admissions"
                        fill
                        className="object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-primary/80 to-primary" />
                </div>

                <div className="container relative z-10 text-left text-white px-4 md:px-8">
                    <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6 max-w-4xl">
                        {banner.title}
                    </h1>
                    <p className="text-xl text-white/70 max-w-2xl font-inter">
                        {banner.description}
                    </p>
                </div>
            </section>

            {/* Dynamic Content Sections */}
            {pageData?.sections?.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((section: any, index: number) => (
                <SectionRenderer key={index} section={section} index={index} />
            ))}

            {/* If no sections found, show a message or call to action */}
            {(!pageData?.sections || pageData.sections.length === 0) && (
                <section className="py-24 bg-white text-center">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-playfair text-primary font-bold mb-8">Admission Information Coming Soon</h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/admissions/apply" className="bg-primary text-white font-black px-12 py-4 rounded-full hover:shadow-xl transition-all uppercase tracking-widest text-sm">Start Online Registration</Link>
                            <Link href="/contact" className="border-2 border-primary text-primary font-black px-8 py-4 rounded-full hover:bg-primary hover:text-white transition-all uppercase tracking-widest text-sm">Contact Admissions Office</Link>
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
