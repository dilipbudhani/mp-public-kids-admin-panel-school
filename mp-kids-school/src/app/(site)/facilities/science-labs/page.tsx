import React from "react";
import { FacilityPageLayout } from "@/components/facilities/FacilityPageLayout";
import { Beaker, FlaskConical, Atom, Microscope, CheckCircle2 } from "lucide-react";
import { dbConnect } from "@/lib/mongodb";
import StaticPage, { IStaticPage } from "@/models/StaticPage";

export const metadata = {
    title: "Science Laboratories | MP Kids School",
    description: "Our advanced laboratories provide students with the tools to explore scientific principles through hands-on experimentation and discovery.",
};

export default async function ScienceLabsPage() {
    await dbConnect();

    const pageData = await StaticPage.findOne({ slug: "facilities-science-labs" }).lean() as IStaticPage | null;

    const content = {
        title: pageData?.title || "Science Laboratories",
        subtitle: pageData?.subtitle || "Innovation & Research",
        description: pageData?.description || "Our advanced laboratories provide students with the tools to explore scientific principles through hands-on experimentation and discovery.",
        image: pageData?.bannerImage || "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2000&auto=format&fit=crop"
    };

    const labs = [
        { title: "Physics Lab", desc: "Equipped for mechanics, optics, and electricity experiments with precision instruments.", icon: Atom },
        { title: "Chemistry Lab", desc: "Modern workstations with advanced safety hoods and a wide range of analytical reagents.", icon: FlaskConical },
        { title: "Biology Lab", desc: "High-resolution microscopes and a rich collection of biological specimens and models.", icon: Microscope },
    ];

    const features = [
        "Individual workstations for hands-on experience",
        "Digital data logging and analysis tools",
        "Strict safety protocols and emergency equipment",
        "Smart display integrated for guided experiments",
        "Spacious layouts for collaborative research",
        "Regular equipment calibration and updates"
    ];

    return (
        <FacilityPageLayout
            title={content.title}
            subtitle={content.subtitle}
            icon="beaker"
            image={content.image}
            description={content.description}
        >
            <div className="prose prose-slate max-w-none">
                <h2 className="text-3xl font-serif font-bold text-accent mb-6">Discovering the Laws of Nature</h2>

                {pageData?.content?.[0] ? (
                    <div className="text-slate-600 leading-relaxed mb-8 prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: (pageData.content as any)[0]?.body || "" }} />
                ) : (
                    <p className="text-slate-600 leading-relaxed mb-8">
                        The science labs at MP Kids School are designed to meet international safety standards and are equipped with sophisticated equipment for Physics, Chemistry, and Biology. We encourage a culture of inquiry where students transition from theory to practice seamlessly.
                    </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 not-prose">
                    {labs.map((lab, i) => (
                        <div key={i} className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                            <lab.icon className="w-8 h-8 text-secondary mb-4" />
                            <h4 className="font-bold text-primary mb-2">{lab.title}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">{lab.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="space-y-8 not-prose">
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-accent mb-4">Laboratory Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                    <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
                        <h3 className="text-xl font-serif font-bold text-accent mb-4">Safety First</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Safety is our paramount concern. All labs are equipped with eye wash stations, fire extinguishers, and first-aid kits. Students are strictly supervised by trained lab assistants and faculty at all times.
                        </p>
                    </div>
                </div>
            </div>
        </FacilityPageLayout>
    );
}
