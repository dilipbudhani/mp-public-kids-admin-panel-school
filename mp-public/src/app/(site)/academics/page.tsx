import React from 'react';
import { motion } from 'framer-motion';
import CurriculumTabs from '@/components/academics/CurriculumTabs';
import Image from 'next/image';
import { dbConnect } from "@/lib/mongodb";
import StaticPage from "@/models/StaticPage";
import SectionRenderer from "@/components/site/SectionRenderer";

export default async function AcademicsPage() {
    await dbConnect();
    const pageData = await StaticPage.findOne({ slug: "academics" }).lean();

    const banner = {
        title: pageData?.title || "Curriculum & Learning Pedagogy",
        description: pageData?.description || "A comprehensive CBSE-aligned framework designed to foster critical thinking, creativity, and career readiness.",
        image: pageData?.bannerImage || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop"
    };

    return (
        <main className="flex flex-col">
            {/* Dynamic Header */}
            <section
                data-hero-dark="true"
                className="relative h-[450px] flex items-center bg-primary overflow-hidden pt-32 pb-16"
            >
                <div className="absolute inset-0 z-0">
                    <Image
                        src={banner.image}
                        alt={banner.title}
                        fill
                        className="object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-primary via-primary/80 to-transparent" />
                </div>

                <div className="container relative z-10 text-white">
                    <div className="max-w-3xl">
                        <span className="text-secondary font-bold tracking-widest text-sm uppercase mb-4 inline-block">
                            Academic Excellence
                        </span>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
                            {banner.title.split(' ').slice(0, -1).join(' ')} <span className="text-secondary">{banner.title.split(' ').slice(-1)}</span>
                        </h1>
                        <p className="text-xl text-white/70">
                            {banner.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Curriculum Tabs Section - Always present but can be supplemented by DB content */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif text-accent font-bold mb-6 italic">Educational Programs</h2>
                        <div className="w-24 h-1 bg-secondary rounded-full mx-auto" />
                    </div>
                    <CurriculumTabs />
                </div>
            </section>

            {/* Dynamic Sections from DB */}
            {pageData?.sections && pageData.sections.length > 0 ? (
                <div className="bg-white">
                    {pageData.sections.map((section: any, index: number) => (
                        <SectionRenderer key={index} section={section} index={index} />
                    ))}
                </div>
            ) : (
                /* Fallback Philosophy Section */
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="w-full lg:w-1/2">
                                <h2 className="text-4xl font-serif text-accent font-bold mb-8 italic">Integrated Pedagogy</h2>
                                <p className="text-slate-600 text-lg mb-8 leading-relaxed italic">
                                    At MP Public School, we go beyond textbooks. Our pedagogy integrates the latest educational technology with traditional experiential learning.
                                </p>
                                <ul className="space-y-6">
                                    {[
                                        { title: 'Project Based Learning', desc: 'Real-world problem solving through collaborative team projects.' },
                                        { title: 'Digital Classrooms', desc: 'Smart boards and digital resources curated for every grade.' },
                                        { title: 'STEM Focus', desc: 'Hands-on laboratory experience from Primary levels onwards.' },
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-4">
                                            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center shrink-0">
                                                <div className="w-2 h-2 bg-secondary rounded-full" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-accent mb-1 italic">{item.title}</h4>
                                                <p className="text-slate-500 text-sm italic">{item.desc}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="w-full lg:w-1/2 relative h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                                <Image
                                    src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=2070&auto=format&fit=crop"
                                    alt="Learning"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
