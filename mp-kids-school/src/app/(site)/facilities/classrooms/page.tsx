import React from "react";
import { FacilityPageLayout } from "@/components/facilities/FacilityPageLayout";
import { Monitor, Cpu, Globe, Zap, CheckCircle2 } from "lucide-react";
import { dbConnect } from "@/lib/mongodb";
import StaticPage, { IStaticPage } from "@/models/StaticPage";

export const metadata = {
    title: "Smart Classrooms | MP Kids School",
    description: "Our classrooms are designed to be dynamic learning environments where technology enhances curiosity and fosters deeper understanding.",
};

export default async function SmartClassroomsPage() {
    await dbConnect();

    const pageData = await StaticPage.findOne({ slug: "facilities-classrooms" }).lean() as IStaticPage | null;

    const content = {
        title: pageData?.title || "Smart Classrooms",
        subtitle: pageData?.subtitle || "Digital Integration",
        description: pageData?.description || "Our classrooms are designed to be dynamic learning environments where technology enhances curiosity and fosters deeper understanding.",
        image: pageData?.bannerImage || "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2000&auto=format&fit=crop"
    };

    // Features from content
    const features = [
        { title: "Interactive Panels", desc: "Ultra-HD touch panels with interactive software for real-time collaboration.", icon: Monitor },
        { title: "Digital Resource Pool", desc: "Access to a vast library of 3D modules, simulations, and virtual field trips.", icon: Globe },
        { title: "Smart Assessment", desc: "Immediate feedback tools and student response systems for personalized learning.", icon: Zap },
        { title: "Adaptive Pedagogy", desc: "Lessons that adapt to the class's pace using AI-driven learning tools.", icon: Cpu },
    ];

    const benefits = [
        "Enhanced visual memory through 3D visualizations",
        "Increased student engagement and participation",
        "Access to global learning resources",
        "Paperless assignments and digital feedback",
        "Real-time progress tracking for teachers",
        "Collaborative problem-solving modules"
    ];

    return (
        <FacilityPageLayout
            title={content.title}
            subtitle={content.subtitle}
            icon="monitor"
            image={content.image}
            description={content.description}
        >
            <div className="prose prose-slate max-w-none">
                <h2 className="text-3xl font-serif font-bold mb-6 text-accent">Interactive Learning Ecosystem</h2>

                {pageData?.sections?.[0] ? (
                    <div className="text-slate-600 leading-relaxed mb-8 prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: pageData.sections[0].content || "" }} />
                ) : (
                    <p className="text-slate-600 leading-relaxed mb-8">
                        MP Kids School believes that technology should be an enabler of pedagogy, not a replacement. Our smart classrooms are equipped with the latest audio-visual aids to make complex concepts intuitive and engaging.
                    </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 not-prose">
                    {features.map((feature, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                                <feature.icon className="w-6 h-6 text-secondary" />
                            </div>
                            <div>
                                <h4 className="font-bold text-primary mb-2">{feature.title}</h4>
                                <p className="text-sm text-slate-500">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 not-prose">
                    <h3 className="text-2xl font-serif font-bold mb-6 text-accent">Key Benefits</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {benefits.map((benefit, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                                {benefit}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </FacilityPageLayout>
    );
}
