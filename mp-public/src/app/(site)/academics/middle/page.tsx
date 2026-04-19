"use client";

import React from "react";
import { AcademicPageLayout } from "@/components/academics/AcademicPageLayout";
import { Microscope, CheckCircle2 } from "lucide-react";
import InlineAdmissionForm from "@/components/admissions/InlineAdmissionForm";

export default function MiddleSchoolPage() {
    return (
        <AcademicPageLayout
            title="Middle School"
            subtitle="Encouraging critical thinking, scientific inquiry, and specialized learning for Classes 6 to 8."
            icon={<Microscope className="w-8 h-8" />}
            heroImage="/images/middle-hero.jpg"
        >
            <div className="prose max-w-none">
                <h2 className="text-3xl font-serif text-primary mb-6">Middle School Program (Classes VI - VIII)</h2>
                <p className="text-text/80 text-lg mb-8">
                    The Middle School marks the transition into adolescence and more demanding academic rigors.
                    Our curriculum is designed to spark curiosity while introducing students to complex
                    abstract concepts in science, mathematics, and humanities.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-surface p-6 rounded-lg border border-gray-100">
                        <h3 className="text-primary font-bold mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-gold rounded-full" />
                            Advanced Academics
                        </h3>
                        <ul className="space-y-3">
                            {[
                                "Integrated Science (Physics, Chem, Bio)",
                                "Advanced Mathematical Reasoning",
                                "Social Sciences (History, Geo, Civics)",
                                "Third Language (Sanskrit/French/Local)",
                                "Coding & Robotics"
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-3 text-sm text-text/80">
                                    <CheckCircle2 className="w-4 h-4 text-accent mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-surface p-6 rounded-lg border border-gray-100">
                        <h3 className="text-primary font-bold mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-accent rounded-full" />
                            Skill Development
                        </h3>
                        <ul className="space-y-3">
                            {[
                                "Critical Thinking Workshops",
                                "Debating & Public Speaking",
                                "Laboratory Inquiry Skills",
                                "Environmental Sustainability Projects",
                                "Leadership & Student Council"
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-3 text-sm text-text/80">
                                    <CheckCircle2 className="w-4 h-4 text-gold mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <h1 className="text-2xl font-serif text-primary mb-6">Discovery-Based Learning</h1>
                <p className="text-text/70 mb-8">
                    We move beyond textbooks to **Project-Based Learning (PBL)**. Students work on quarterly
                    projects that require research, data collection, and presentation. This builds
                    self-reliance and prepares them for the competitive nature of secondary education.
                </p>

                <div className="bg-surface p-8 rounded-xl border-2 border-dashed border-gray-200 mb-12">
                    <h4 className="text-primary font-bold mb-4">Vocational Exposure</h4>
                    <p className="text-text/70 mb-4">
                        In line with NEP 2020, we offer "Bagless Days" where students interact with local
                        artisans, experts, and professionals to understand vocational crafts and skills.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {["Carpentry", "Gardening", "Electronics", "Financial Literacy"].map(v => (
                            <span key={v} className="bg-white px-3 py-1 rounded-full border text-xs font-semibold text-text/60">
                                {v}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-16 max-w-2xl mx-auto">
                    <h3 className="text-2xl font-serif text-primary mb-6 text-center">Inquiry-Based Learning Starts Here</h3>
                    <InlineAdmissionForm defaultClass="Middle School" />
                </div>
            </div>
        </AcademicPageLayout>
    );
}
