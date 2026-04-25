import React from "react";
import { AcademicPageLayout } from "@/components/academics/AcademicPageLayout";
import { GraduationCap, CheckCircle2 } from "lucide-react";
import InlineAdmissionForm from "@/components/admissions/InlineAdmissionForm";
import { dbConnect } from "@/lib/mongodb";
import StaticPage from "@/models/StaticPage";
import SectionRenderer from "@/components/site/SectionRenderer";

export default async function SecondarySchoolPage() {
    await dbConnect();
    const schoolId = process.env.SCHOOL_ID || "mp-public";

    const pageData = await StaticPage.findOne({
        slug: "academics-secondary",
        schoolIds: schoolId
    }).lean();

    const content = {
        title: pageData?.title || "Secondary School",
        subtitle: pageData?.subtitle || "Excellence in board performance and comprehensive career guidance for Classes 9 and 10.",
        bannerImage: pageData?.bannerImage || "/images/secondary-hero.jpg"
    };

    return (
        <AcademicPageLayout
            title={content.title}
            subtitle={content.subtitle}
            icon={<GraduationCap className="w-8 h-8" />}
            heroImage={content.bannerImage}
        >
            <div className="prose max-w-none">
                {pageData?.sections && pageData.sections.length > 0 ? (
                    <div className="space-y-12">
                        {pageData.sections.map((section: any, index: number) => (
                            <SectionRenderer key={index} section={section} index={index} />
                        ))}
                    </div>
                ) : (
                    /* Fallback content */
                    <>
                        <h2 className="text-3xl font-serif text-primary mb-6">Secondary Program (Classes IX - X)</h2>
                        <p className="text-text/80 text-lg mb-8">
                            The Secondary Wing is geared towards academic excellence and performance in the **CBSE AISSE
                            (Class X Board Exams)**. We emphasize conceptual clarity, rigorous practice, and the development
                            of effective examination techniques.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            <div className="bg-surface p-6 rounded-lg border border-gray-100">
                                <h3 className="text-primary font-bold mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-gold rounded-full" />
                                    Board Preparation
                                </h3>
                                <ul className="space-y-3">
                                    {[
                                        "Strict Adherence to NCERT Curriculum",
                                        "Regular Mock Examinations & Assessments",
                                        "Remedial Classes for Subject Mastery",
                                        "Solved Previous Year Questions (PYQ)",
                                        "One-on-One Performance Analysis"
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
                                    Beyond the Boards
                                </h3>
                                <ul className="space-y-3">
                                    {[
                                        "Career Counseling & Aptitude Testing",
                                        "Stream Selection Guidance",
                                        "Competitive Exam Orientation (NTSE)",
                                        "Social Empowerment Projects",
                                        "Advanced ICT & AI Literacy"
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-3 text-sm text-text/80">
                                            <CheckCircle2 className="w-4 h-4 text-gold mt-0.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <h3 className="text-2xl font-serif text-primary mb-6">A Disciplined Environment</h3>
                        <p className="text-text/70 mb-8">
                            We maintain a balance between academic pressure and emotional well-being. Our dedicated
                            counseling cell provides stress management workshops and motivational sessions to help
                            students navigate the challenges of their first board examination with confidence.
                        </p>

                        <div className="bg-primary text-white p-8 rounded-xl flex items-center gap-6 mb-12">
                            <div className="hidden md:block bg-gold p-4 rounded-full">
                                <GraduationCap className="text-primary w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="text-gold font-bold mb-1">Scholarship Program</h4>
                                <p className="text-white/80 text-sm">
                                    Meritorious students in Class IX and X are eligible for our 'Academic Excellence
                                    Scholarship' which covers up to 50% of the annual tuition fee based on performance.
                                </p>
                            </div>
                        </div>
                    </>
                )}

                <div className="mt-16 max-w-2xl mx-auto">
                    <h3 className="text-2xl font-serif text-primary mb-6 text-center">Prepare for Success</h3>
                    <InlineAdmissionForm defaultClass="Secondary" />
                </div>
            </div>
        </AcademicPageLayout>
    );
}
