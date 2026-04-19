import React from "react";
import { FacilityPageLayout } from "@/components/facilities/FacilityPageLayout";
import { Trophy, Target, Dumbbell, Users, CheckCircle2 } from "lucide-react";
import { dbConnect } from "@/lib/mongodb";
import StaticPage, { IStaticPage } from "@/models/StaticPage";

export const metadata = {
    title: "Sports Excellence | MP Public School",
    description: "Explore the world-class sports infrastructure at MP Public School where we foster discipline, teamwork, and resilience in every student.",
};

const iconMap: Record<string, any> = {
    Target: Target,
    Users: Users,
    Dumbbell: Dumbbell,
};

export default async function SportsFacilitiesPage() {
    await dbConnect();

    const pageData = await StaticPage.findOne({ slug: "sports-facilities", schoolIds: process.env.SCHOOL_ID }).lean() as IStaticPage | null;

    const content = {
        title: pageData?.title || "Sports Excellence",
        subtitle: pageData?.subtitle || "Holistic Development",
        description: pageData?.description || "We believe that sports are essential for character building, instilling discipline, teamwork, and resilience in every student.",
        image: pageData?.bannerImage || "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2000&auto=format&fit=crop"
    };

    const coreSportsSection = pageData?.sections?.find(s => s.key === 'core_sports');
    const infraDetailsSection = pageData?.sections?.find(s => s.key === 'infrastructure_details');

    const coreSports = coreSportsSection?.items?.map((item: any) => ({
        name: item.title,
        desc: item.description || "",
        icon: iconMap[item.icon || "Trophy"] || Trophy
    })) || [
            { name: "Basketball", icon: Target, desc: "Standard courts" },
            { name: "Football", icon: Users, desc: "Natural turf field" },
            { name: "Swimming", icon: Users, desc: "Olympic size pool" },
            { name: "Athletics", icon: Dumbbell, desc: "All-weather track" }
        ];

    const infraDetails = infraDetailsSection?.items?.map((item: any) => item.title) || [
        "Multi-purpose Indoor Sports Hall",
        "Tournament-level Cricket Practice Nets",
        "Fully-equipped Fitness & Yoga Studio",
        "Table Tennis & Chess Arenas",
        "Floodlight facility for evening training",
        "Professional-grade Skating Rink"
    ];

    return (
        <FacilityPageLayout
            title={content.title}
            subtitle={content.subtitle}
            icon="trophy"
            image={content.image}
            description={content.description}
        >
            <div className="prose prose-slate max-w-none">
                <h2 className="text-3xl font-serif font-bold text-accent mb-6">Championing the Athlete Within</h2>

                {pageData?.content?.[0] ? (
                    <div className="text-slate-600 leading-relaxed mb-8 prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: (pageData.content as any)[0]?.body || "" }} />
                ) : (
                    <p className="text-slate-600 leading-relaxed mb-8">
                        MP Public School offers world-class sports infrastructure that caters to a wide variety of indoor and outdoor activities. Our professional coaching staff ensures that students can pursue their passion for sports at competitive levels.
                    </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 not-prose">
                    {coreSports.map((sport: any, i: number) => (
                        <div key={i} className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-secondary transition-all group">
                            <sport.icon className="w-8 h-8 text-secondary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                            <h4 className="font-bold text-primary text-sm mb-1">{sport.name}</h4>
                            <p className="text-[10px] text-slate-500">{sport.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 not-prose">
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-accent mb-6">Infrastructure Details</h3>
                        <ul className="space-y-4">
                            {infraDetails.map((item: any, i: number) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                    <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 flex flex-col justify-center">
                        <Trophy className="w-12 h-12 text-secondary mb-4" />
                        <h3 className="text-xl font-serif font-bold text-primary mb-3">Sports Scholarships</h3>
                        <p className="text-sm text-slate-600 leading-relaxed mb-6">
                            Exceptional athletes representing the school at National and International levels are eligible for our prestigious Sports Excellence Scholarship program.
                        </p>
                        <button className="bg-primary text-white rounded-full text-xs py-2.5 w-fit px-8 font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                            Apply for Trial
                        </button>
                    </div>
                </div>
            </div>
        </FacilityPageLayout>
    );
}
