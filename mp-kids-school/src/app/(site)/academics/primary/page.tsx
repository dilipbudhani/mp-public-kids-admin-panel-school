"use client";

import React from "react";
import { AcademicPageLayout } from "@/components/academics/AcademicPageLayout";
import { Book, CheckCircle2 } from "lucide-react";
import InlineAdmissionForm from "@/components/admissions/InlineAdmissionForm";

export default function PrimaryPage() {
    return (
        <AcademicPageLayout
            title="Primary Wing"
            subtitle="Building a strong foundation in core subjects and essential life skills for Classes 1 to 5."
            icon={<Book className="w-8 h-8" />}
            heroImage="/images/primary-hero.jpg"
        >
            <div className="prose max-w-none">
                <h2 className="text-3xl font-serif text-primary mb-6">Primary Education (Classes I - V)</h2>
                <p className="text-text/80 text-lg mb-8">
                    In the Primary Wing, we transition from play-based learning to a more structured academic
                    curriculum while maintaining an inquiry-based approach. Our focus is on achieving foundational
                    numeracy and literacy as per the **NIPUN Bharat guidelines**.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-surface p-6 rounded-lg border border-gray-100">
                        <h3 className="text-primary font-bold mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-gold rounded-full" />
                            Core Curriculum
                        </h3>
                        <ul className="space-y-3">
                            {[
                                "Language Arts (English & Hindi)",
                                "Mathematics & Mental Math",
                                "Environmental Studies (EVS)",
                                "Information Technology (ICT)",
                                "Moral & Cultural Education"
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
                            Co-Scholastic Program
                        </h3>
                        <ul className="space-y-3">
                            {[
                                "Performing Arts (Dance/Music)",
                                "Physical Education & Yoga",
                                "Clay Modeling & Origami",
                                "Speech & Drama",
                                "Reading Clubs"
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-3 text-sm text-text/80">
                                    <CheckCircle2 className="w-4 h-4 text-gold mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <h3 className="text-2xl font-serif text-primary mb-6">Innovative Pedagogy</h3>
                <p className="text-text/70 mb-8">
                    We utilize **Thematic Learning**, where different subjects are integrated around a central theme,
                    making education more relevant to the real world. Smartboards, educational games, and outdoor
                    field trips ensure that students remain engaged and motivated.
                </p>

                <div className="border-l-4 border-accent bg-accent/5 p-8 rounded-r-xl mb-12">
                    <h4 className="text-primary font-bold mb-2">Developmental Milestone Tracking</h4>
                    <p className="text-text/70 text-sm">
                        We provide comprehensive progress cards that track not just academic grades, but also
                        emotional intelligence, physical coordination, and social behavior, fostering
                        holistic growth.
                    </p>
                </div>

                <div className="mt-16 max-w-2xl mx-auto">
                    <h3 className="text-2xl font-serif text-primary mb-6 text-center">Start Your Child's Journey with Us</h3>
                    <InlineAdmissionForm defaultClass="Primary" />
                </div>
            </div>
        </AcademicPageLayout>
    );
}
