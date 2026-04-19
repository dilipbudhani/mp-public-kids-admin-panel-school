"use client";

import React from "react";
import { AcademicPageLayout } from "@/components/academics/AcademicPageLayout";
import { Star, CheckCircle2, FlaskConical, Landmark, Computer } from "lucide-react";
import InlineAdmissionForm from "@/components/admissions/InlineAdmissionForm";

export default function SeniorSecondarySchoolPage() {
    return (
        <AcademicPageLayout
            title="Senior Secondary"
            subtitle="Specialized stream-based education for Classes 11 and 12, fostering future leaders and innovators."
            icon={<Star className="w-8 h-8" />}
            heroImage="/images/senior-hero.jpg"
        >
            <div className="prose max-w-none">
                <h2 className="text-3xl font-serif text-primary mb-6">Senior Secondary (Classes XI - XII)</h2>
                <p className="text-text/80 text-lg mb-8">
                    The Senior Secondary years at MP Public School are designed to provide students with
                    the academic foundation and competitive edge needed for university admissions and career
                    success. We offer specialized streams in **Science, Commerce, and Humanities**.
                </p>

                {/* Stream Sections */}
                <div className="space-y-8 mb-12">
                    {/* Science Stream */}
                    <div className="bg-surface p-6 rounded-lg border-l-4 border-accent">
                        <h3 className="text-primary font-bold mb-4 flex items-center gap-3">
                            <FlaskConical className="text-accent" />
                            Science Stream
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <ul className="space-y-2">
                                <li className="text-sm font-semibold text-primary">Group A (Medical):</li>
                                {["English Core", "Physics", "Chemistry", "Biology", "Psychology/Physical Ed"].map(s => (
                                    <li key={s} className="text-xs text-text/70 flex items-center gap-2">
                                        <CheckCircle2 className="w-3 h-3 text-accent" /> {s}
                                    </li>
                                ))}
                            </ul>
                            <ul className="space-y-2">
                                <li className="text-sm font-semibold text-primary">Group B (Non-Medical):</li>
                                {["English Core", "Physics", "Chemistry", "Mathematics", "Computer Science"].map(s => (
                                    <li key={s} className="text-xs text-text/70 flex items-center gap-2">
                                        <CheckCircle2 className="w-3 h-3 text-accent" /> {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Commerce Stream */}
                    <div className="bg-surface p-6 rounded-lg border-l-4 border-gold">
                        <h3 className="text-primary font-bold mb-4 flex items-center gap-3">
                            <Landmark className="text-gold" />
                            Commerce Stream
                        </h3>
                        <p className="text-xs text-text/70 mb-4 font-semibold uppercase">Subjects Offered:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {[
                                "English Core",
                                "Accountancy",
                                "Business Studies",
                                "Economics",
                                "Mathematics",
                                "Entrepreneurship"
                            ].map(s => (
                                <div key={s} className="text-xs bg-white p-2 border rounded shadow-sm text-center">
                                    {s}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Humanities Stream */}
                    <div className="bg-surface p-6 rounded-lg border-l-4 border-primary">
                        <h3 className="text-primary font-bold mb-4 flex items-center gap-3">
                            <Computer className="text-primary" />
                            Humanities Stream
                        </h3>
                        <p className="text-xs text-text/70 mb-4 font-semibold uppercase">Potential Electives:</p>
                        <div className="flex flex-wrap gap-2">
                            {["History", "Political Science", "Geography", "Sociology", "Legal Studies", "Fine Arts"].map(s => (
                                <span key={s} className="bg-primary/5 text-primary text-[10px] px-2 py-1 rounded font-bold">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <h3 className="text-2xl font-serif text-primary mb-6">Competitive Edge</h3>
                <p className="text-text/70 mb-8">
                    Beyond the CBSE AISSCE curriculum, we provide in-house coaching modules for **JEE, NEET, and
                    CUET**. Our laboratories are equipped for university-level research, and our tie-ups with
                    global educational consultants help students with abroad applications and profile building.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-gold/10 p-6 rounded-xl border border-gold/30">
                        <h4 className="text-primary font-bold mb-2">University Placements</h4>
                        <p className="text-xs text-text/70">
                            Our alumni are studying at prestigious institutions like IITs, AIIMS, SRCC, and leading
                            international universities.
                        </p>
                    </div>
                    <div className="bg-accent/10 p-6 rounded-xl border border-accent/30">
                        <h4 className="text-primary font-bold mb-2">Career Mentorship</h4>
                        <p className="text-xs text-text/70">
                            Monthly seminars with industry experts and mental health workshops to manage high
                            academic stakes.
                        </p>
                    </div>
                </div>

                <div className="mt-16 max-w-2xl mx-auto">
                    <h3 className="text-2xl font-serif text-primary mb-6 text-center">Shape Your Future</h3>
                    <InlineAdmissionForm defaultClass="Senior Secondary" />
                </div>
            </div>
        </AcademicPageLayout>
    );
}
