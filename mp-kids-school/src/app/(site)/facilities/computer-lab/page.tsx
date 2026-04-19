import React from "react";
import { FacilityPageLayout } from "@/components/facilities/FacilityPageLayout";
import { Cpu, Terminal, Wifi, ShieldCheck, CheckCircle2 } from "lucide-react";
import { dbConnect } from "@/lib/mongodb";
import StaticPage, { IStaticPage } from "@/models/StaticPage";

export const metadata = {
    title: "Computing Infrastructure | MP Kids School",
    description: "Our advanced computing labs are designed to cultivate digital literacy, coding skills, and technological innovation among students.",
};

export default async function ComputerLabPage() {
    await dbConnect();

    const pageData = await StaticPage.findOne({ slug: "facilities-computer-lab" }).lean() as IStaticPage | null;

    const content = {
        title: pageData?.title || "Computing Infrastructure",
        subtitle: pageData?.subtitle || "Future Ready",
        description: pageData?.description || "Our advanced computing labs are designed to cultivate digital literacy, coding skills, and technological innovation among students.",
        image: pageData?.bannerImage || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2000&auto=format&fit=crop"
    };

    const features = [
        { title: "Coding & Robotics", dsc: "Dedicated kits for Arduino, Raspberry Pi, and advanced robotics modules.", icon: Terminal },
        { title: "High-Speed Connectivity", dsc: "Gigabit ethernet and secure campus-wide Wi-Fi for seamless research.", icon: Wifi },
        { title: "Safe Computing", dsc: "Advanced firewalls and content filtering to ensure an educational environment.", icon: ShieldCheck },
        { title: "Modern Hardware", dsc: "Latest generation workstations and graphic tablets for digital arts.", icon: Cpu },
    ];

    const curriculum = [
        "Python & Java Programming Basics",
        "Web Design & Development (HTML/CSS/JS)",
        "Artificial Intelligence & Machine Learning",
        "Digital Citizenship & Online Safety",
        "Robotics & IoT Prototyping",
        "Data Analysis & Visualization Tools"
    ];

    return (
        <FacilityPageLayout
            title={content.title}
            subtitle={content.subtitle}
            icon="cpu"
            image={content.image}
            description={content.description}
        >
            <div className="prose prose-slate max-w-none">
                <h2 className="text-3xl font-serif font-bold text-accent mb-6">Empowering Digital Citizens</h2>

                {pageData?.content?.[0] ? (
                    <div className="text-slate-600 leading-relaxed mb-8 prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: (pageData.content as any)[0]?.body || "" }} />
                ) : (
                    <p className="text-slate-600 leading-relaxed mb-8">
                        In an increasingly digital world, we ensure our students are creators, not just consumers of technology. Our computer labs feature high-end workstations and dedicated zones for robotics, AI, and software development.
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
                                <p className="text-sm text-slate-500">{feature.dsc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 not-prose">
                    <h3 className="text-2xl font-serif font-bold text-accent mb-6">Technology Curriculum</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        {curriculum.map((topic, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium py-2 border-b border-slate-200/50">
                                <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                                {topic}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </FacilityPageLayout>
    );
}
