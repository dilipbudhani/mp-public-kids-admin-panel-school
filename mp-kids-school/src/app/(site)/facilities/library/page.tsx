import React from "react";
import { FacilityPageLayout } from "@/components/facilities/FacilityPageLayout";
import { BookOpen, Search, CheckCircle2 } from "lucide-react";
import { dbConnect } from "@/lib/mongodb";
import StaticPage, { IStaticPage } from "@/models/StaticPage";

export const metadata = {
    title: "School Library | MP Kids School",
    description: "Our library is a sanctuary for learners, housing a vast collection of resources that ignite imagination and foster a lifelong love for reading.",
};

const iconMap: Record<string, any> = {
    BookOpen: BookOpen,
    Search: Search,
};

export default async function LibraryPage() {
    await dbConnect();

    const pageData = await StaticPage.findOne({ slug: "facilities-library" }).lean() as IStaticPage | null;

    const content = {
        title: pageData?.title || "School Library",
        subtitle: pageData?.subtitle || "The Knowledge Hub",
        description: pageData?.description || "Our library is a sanctuary for learners, housing a vast collection of resources that ignite imagination and foster a lifelong love for reading.",
        image: pageData?.bannerImage || "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2000&auto=format&fit=crop"
    };

    const collectionsSection = pageData?.sections?.find(s => s.key === 'collections');
    const facilitiesSection = pageData?.sections?.find(s => s.key === 'core_facilities');

    const collections = collectionsSection?.items?.map((item: any) => ({
        title: item.title,
        desc: item.description || "",
        icon: iconMap[item.icon || "BookOpen"] || BookOpen
    })) || [
            { title: "20,000+ Print Volumes", desc: "Extensive collection spanning fiction, non-fiction, academic journals, and regional literature.", icon: BookOpen },
            { title: "Digital Archives", desc: "Subscription to global e-libraries like JSTOR and Britannica for advanced research.", icon: Search },
        ];

    const facilities = facilitiesSection?.items?.map((item: any) => item.title) || [
        "Quiet Study Zones for Individual Work",
        "Collaborative Learning Booths",
        "Kindle & E-Reader Lending Section",
        "Reference Section with Rare Manuscripts",
        "Storytelling Corner for Lower Grades",
        "Online Public Access Catalog (OPAC)"
    ];

    return (
        <FacilityPageLayout
            title={content.title}
            subtitle={content.subtitle}
            icon="library"
            image={content.image}
            description={content.description}
        >
            <div className="prose prose-slate max-w-none">
                <h2 className="text-3xl font-serif font-bold text-accent mb-6">A Sanctuary for Learning</h2>

                {pageData?.content?.[0] ? (
                    <div className="text-slate-600 leading-relaxed mb-8 prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: (pageData.content as any)[0]?.body || "" }} />
                ) : (
                    <p className="text-slate-600 leading-relaxed mb-8">
                        The library at MP Kids School is more than just a room full of books. It is a modern resource center equipped with digital archives, quiet reading zones, and collaborative spaces designed to inspire scholarly pursuit.
                    </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 not-prose">
                    {collections.map((item: any, i: number) => (
                        <div key={i} className="flex gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <item.icon className="w-10 h-10 text-secondary shrink-0" />
                            <div>
                                <h4 className="font-bold text-primary mb-1">{item.title}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-8 not-prose">
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-accent mb-4">Core Facilities</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {facilities.map((facility: any, i: number) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                    <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                                    {facility}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-primary text-white rounded-2xl p-8 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-serif font-bold mb-4">Weekly Reading Program</h3>
                            <p className="text-sm text-white/80 leading-relaxed mb-6">
                                We host regular Book Clubs, Author Interactions, and Literary Fests to encourage students to go beyond the curriculum and explore the world of ideas.
                            </p>
                            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-secondary">
                                <span>Literary Fest 2025</span>
                                <span className="w-10 h-px bg-secondary/50" />
                                <span>Coming Soon</span>
                            </div>
                        </div>
                        <Search className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 rotate-12" />
                    </div>
                </div>
            </div>
        </FacilityPageLayout>
    );
}
