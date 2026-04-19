"use client";

import React from "react";
import { AcademicPageLayout } from "@/components/academics/AcademicPageLayout";
import { Pencil, CheckCircle2 } from "lucide-react";
import InlineAdmissionForm from "@/components/admissions/InlineAdmissionForm";

export default function PrePrimaryPage() {
    return (
        <AcademicPageLayout
            title="Pre-Primary Wing"
            subtitle="Nurturing curiosity and social skills through play-based learning for our youngest learners (Playgroup to KG)."
            icon={<Pencil className="w-8 h-8" />}
            heroImage="/images/pre-primary-hero.jpg"
        >
            <div className="prose max-w-none">
                <h2 className="text-3xl font-serif text-primary mb-6">Foundational Years (Playgroup - KG II)</h2>
                <p className="text-text/80 text-lg mb-8">
                    The Pre-Primary years are the most critical for a child's cognitive and emotional development.
                    At MP Public School, we follow a unique **Play-Way and Montessori-inspired pedagogy** that encourages
                    natural curiosity while building essential motor and social skills.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-surface p-6 rounded-lg border border-gray-100">
                        <h3 className="text-primary font-bold mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-gold rounded-full" />
                            Focus Areas
                        </h3>
                        <ul className="space-y-3">
                            {[
                                "Language & Literacy Development",
                                "Logical - Mathematical Thinking",
                                "Sensory & Motor Skills",
                                "Creative Expression (Art & Music)",
                                "Social & Emotional Maturity"
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
                            Interactive Facilities
                        </h3>
                        <ul className="space-y-3">
                            {[
                                "Indoor Play Station",
                                "Audio-Visual Learning Room",
                                "Storytelling Corner",
                                "Splash Pool (Supervised)",
                                "Montessori Lab"
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-3 text-sm text-text/80">
                                    <CheckCircle2 className="w-4 h-4 text-gold mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <h3 className="text-2xl font-serif text-primary mb-6">Our Teaching Philosophy</h3>
                <p className="text-text/70 mb-8">
                    We believe every child is a unique learner. Our classrooms are designed as activity centers where
                    learning happens through exploration. With a low teacher-student ratio, we ensure personalized
                    attention and a safe, nurturing environment for every child.
                </p>

                <div className="bg-primary text-white p-8 rounded-xl mb-12">
                    <h4 className="text-gold font-bold mb-2">NEP 2020 Integration</h4>
                    <p className="text-white/80 text-sm italic">
                        "Our curriculum is fully aligned with the National Education Policy guidelines for
                        Foundational Stage education, focusing on ECCE (Early Childhood Care and Education)."
                    </p>
                </div>

                <div className="mt-16 max-w-2xl mx-auto">
                    <h3 className="text-2xl font-serif text-primary mb-6 text-center">Interested in Pre-Primary Admission?</h3>
                    <InlineAdmissionForm defaultClass="Pre-Primary" />
                </div>
            </div>
        </AcademicPageLayout>
    );
}
