import React from "react";
import { AboutPageLayout } from "@/components/about/AboutPageLayout";
import { Info, Award, Shield, Zap } from "lucide-react";
import { dbConnect } from "@/lib/mongodb";
import StaticPage from "@/models/StaticPage";
import SectionRenderer from "@/components/site/SectionRenderer";

export const metadata = {
    title: "Overview | About Us | MP Public School",
    description: "Learn about the history, identity, and core focus areas of MP Public School. Over 25 years of academic excellence.",
};

export default async function AboutOverviewPage() {
    await dbConnect();
    const pageData = await StaticPage.findOne({ slug: "about-overview", schoolIds: process.env.SCHOOL_ID }).lean();

    const banner = {
        title: pageData?.title || "Overview of Excellence",
        description: pageData?.description || "Founded in 1995, MP Public School has been a beacon of quality education, blending traditional values with modern innovation.",
        image: pageData?.bannerImage || "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop"
    };

    const hasDynamicSections = pageData?.sections && pageData.sections.length > 0;

    return (
        <AboutPageLayout
            title={banner.title}
            subtitle="Who We Are"
            description={banner.description}
            icon="info"
            image={banner.image}
        >
            <div className="space-y-12">
                {hasDynamicSections ? (
                    <div className="bg-white">
                        {pageData.sections.map((section: any, index: number) => (
                            <SectionRenderer key={index} section={section} index={index} />
                        ))}
                    </div>
                ) : (
                    /* Fallback Sections */
                    <div className="space-y-12">
                        <section>
                            <h2 className="text-3xl font-playfair font-bold text-primary mb-6 italic">Our Identity</h2>
                            <p className="text-slate-600 leading-relaxed text-lg mb-8 italic">
                                MP Public School is more than just a school; it is a community dedicated to the holistic development of every child. We believe in nurturing curious minds and compassionate hearts through a curriculum that challenges and inspires.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                <div className="bg-surface rounded-2xl p-6 border border-slate-100 shadow-sm transition-hover">
                                    <Award className="w-8 h-8 text-secondary mb-4" />
                                    <h4 className="font-bold text-primary mb-1 uppercase text-xs tracking-widest italic">25+ Years</h4>
                                    <p className="text-[10px] text-slate-500 font-medium">of Academic Excellence</p>
                                </div>
                                <div className="bg-surface rounded-2xl p-6 border border-slate-100 shadow-sm transition-hover">
                                    <Zap className="w-8 h-8 text-secondary mb-4" />
                                    <h4 className="font-bold text-primary mb-1 uppercase text-xs tracking-widest italic">Global Pedagogy</h4>
                                    <p className="text-[10px] text-slate-500 font-medium">Blended Learning Model</p>
                                </div>
                                <div className="bg-surface rounded-2xl p-6 border border-slate-100 shadow-sm transition-hover">
                                    <Shield className="w-8 h-8 text-secondary mb-4" />
                                    <h4 className="font-bold text-primary mb-1 uppercase text-xs tracking-widest italic">Safe Campus</h4>
                                    <p className="text-[10px] text-slate-500 font-medium">ISO Certified Environment</p>
                                </div>
                            </div>
                        </section>

                        <section className="bg-primary/5 rounded-[2.5rem] p-8 md:p-12 border border-primary/10">
                            <div className="max-w-2xl">
                                <h2 className="text-2xl font-playfair font-bold text-primary mb-4 italic">Commitment & Innovation</h2>
                                <p className="text-slate-600 leading-relaxed mb-6 italic">
                                    Ensuring we stay ahead of educational trends while keeping our core values intact.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    {["NEP 2020 Aligned", "STEM Integration", "Value-Based Learning", "Holistic Growth"].map((tag, i) => (
                                        <span key={i} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-black text-primary/60 uppercase tracking-widest shadow-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </AboutPageLayout>
    );
}
