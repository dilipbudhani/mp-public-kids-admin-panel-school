import React from "react";
import { FacilityPageLayout } from "@/components/facilities/FacilityPageLayout";
import { LucideIcon, Building2, CheckCircle2, FlaskConical, Laptop, Library, Trophy, Bus, Globe, Zap, ShieldCheck, Wifi } from "lucide-react";
import { dbConnect } from "@/lib/mongodb";
import StaticPage, { IStaticPage } from "@/models/StaticPage";

export const metadata = {
    title: "World-Class Facilities | MP Kids School",
    description: "Explore the state-of-the-art infrastructure and facilities at MP Kids School designed for holistic student development.",
};

const iconMap: Record<string, LucideIcon> = {
    FlaskConical,
    Laptop,
    Library,
    Trophy,
    Bus,
    Building2,
    Globe,
    Zap,
    ShieldCheck,
    Wifi
};

export default async function FacilitiesOverview() {
    await dbConnect();

    const pageData = await StaticPage.findOne({ slug: "facilities", schoolIds: process.env.SCHOOL_ID }).lean() as IStaticPage | null;

    const coreContent = {
        title: pageData?.title || "World-Class Facilities",
        subtitle: pageData?.subtitle || "Built for Excellence",
        description: pageData?.description || "MP Kids School features a sprawling 15-acre campus with state-of-the-art infrastructure designed to foster academic, athletic, and creative growth.",
        image: pageData?.bannerImage || "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop"
    };

    // Infrastructure Hub section
    const infraHub = pageData?.sections?.find((s: any) => s.key === 'overview' || s.title.toLowerCase().includes("hub") || s.title.toLowerCase().includes("pillars")) || {
        title: "Infrastructure Hub",
        content: "Our campus is a masterstroke of design, integrating green spaces with high-tech learning environments. Every corner of our school is designed with the student in mind—safe, inspiring, and technologically advanced.",
    };

    const defaultPillars = [
        { title: "Science Hub", desc: "Integrated labs for Physics, Chemistry, and Biology.", icon: FlaskConical, color: "bg-blue-50 text-blue-600" },
        { title: "Digital Labs", desc: "Next-gen computer labs with AI and coding kits.", icon: Laptop, color: "bg-indigo-50 text-indigo-600" },
        { title: "Knowledge Center", desc: "A library with over 20,000 titles and digital access.", icon: Library, color: "bg-amber-50 text-amber-600" },
        { title: "Sports Arena", desc: "International standard track and indoor complex.", icon: Trophy, color: "bg-emerald-50 text-emerald-600" },
        { title: "Transport", desc: "GPS-tracked AC bus fleet covering the entire city.", icon: Bus, color: "bg-rose-50 text-rose-600" },
        { title: "Smart Classes", desc: "Interactive boards and AR/VR learning modules.", icon: Building2, color: "bg-gold/10 text-gold" },
    ];

    const hubChecklist = [
        "Smart Classrooms in Every Wing",
        "Eco-friendly Solar Powered Campus",
        "CCTV Secured Learning Spaces",
        "Fully WiFi Enabled Block"
    ];

    const pillarsSection = pageData?.sections?.find((s: any) => s.key === "pillars");
    const checklistSection = pageData?.sections?.find((s: any) => s.key === "checklist");

    const pillars = pillarsSection?.items?.map((item: any) => ({
        title: item.title,
        desc: item.description || "",
        icon: iconMap[item.icon] || Building2,
        color: item.color || "bg-slate-50 text-slate-600"
    })) || defaultPillars;

    const checklist = checklistSection?.items?.map((item: any) => item.title) || hubChecklist;

    return (
        <FacilityPageLayout
            title={coreContent.title}
            subtitle={coreContent.subtitle}
            description={coreContent.description}
            icon="building"
            image={coreContent.image}
        >
            <div className="space-y-12">
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col justify-center">
                        <h2 className="text-3xl font-serif font-bold mb-4 text-accent">{infraHub.title}</h2>
                        <div
                            className="text-slate-600 leading-relaxed mb-6 prose prose-slate max-w-none"
                            dangerouslySetInnerHTML={{ __html: infraHub.content || "" }}
                        />

                        <div className="space-y-3">
                            {checklist.map((item: any, i: number) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="aspect-video bg-slate-200 rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                        <img
                            src={coreContent.image}
                            alt={infraHub.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl font-serif font-bold mb-8 text-center italic text-accent">Core Infrastructure Pillars</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {pillars.map((facility: any, i: number) => {
                            const Icon = facility.icon;
                            return (
                                <div
                                    key={i}
                                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-default group"
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${facility.color}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-bold text-primary mb-2">{facility.title}</h4>
                                    <p className="text-sm text-slate-500 line-clamp-2">{facility.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </FacilityPageLayout>
    );
}
