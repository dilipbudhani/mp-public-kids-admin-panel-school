import React from "react";
import { FacilityPageLayout } from "@/components/facilities/FacilityPageLayout";
import { Bus, ShieldCheck, MapPin, Clock, CheckCircle2, Phone, Mail, Users } from "lucide-react";
import { dbConnect } from "@/lib/mongodb";
import StaticPage, { IStaticPage } from "@/models/StaticPage";

export const metadata = {
    title: "Safe Transportation | MP Public School",
    description: "Our fleet of modern school buses ensures a safe, comfortable, and punctual commute for our students across the city.",
};

export default async function TransportationPage() {
    await dbConnect();

    const pageData = await StaticPage.findOne({ slug: "facilities-transport" }).lean() as IStaticPage | null;

    const content = {
        title: pageData?.title || "Safe Transportation",
        subtitle: pageData?.subtitle || "Campus Connectivity",
        description: pageData?.description || "Our fleet of modern school buses ensures a safe, comfortable, and punctual commute for our students across the city.",
        image: pageData?.bannerImage || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2000&auto=format&fit=crop"
    };

    const features = [
        { title: "GPS Tracking", desc: "Real-time tracking available for parents through our dedicated mobile app.", icon: ShieldCheck },
        { title: "Extensive Coverage", desc: "Connecting all major residential areas with optimized, time-efficient routes.", icon: MapPin },
        { title: "Punctuality First", desc: "Strict adherence to timings to ensure students reach school refreshed and on time.", icon: Clock },
        { title: "Trained Personnel", desc: "Background-verified drivers and female attendants on every bus.", icon: Users },
    ];

    const protocols = [
        "CCTV surveillance in all buses",
        "Speed governors for controlled movement",
        "First-aid kits and fire extinguishers on board",
        "Mandatory breath analyzer tests for drivers",
        "Emergency panic buttons connected to HQ",
        "Attendance tracking for board/de-board"
    ];

    return (
        <FacilityPageLayout
            title={content.title}
            subtitle={content.subtitle}
            icon="bus"
            image={content.image}
            description={content.description}
        >
            <div className="prose prose-slate max-w-none">
                <h2 className="text-3xl font-serif font-bold text-accent mb-6">Commuting with Convenience</h2>

                {pageData?.content?.[0] ? (
                    <div className="text-slate-600 leading-relaxed mb-8 prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: (pageData.content as any)[0]?.body || "" }} />
                ) : (
                    <p className="text-slate-600 leading-relaxed mb-8">
                        MP Public School provides a robust transportation network with a fleet of well-maintained buses. Each bus is equipped with advanced safety features and is manned by trained staff to ensure the safety of every child.
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

                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 mb-12 not-prose">
                    <h3 className="text-2xl font-serif font-bold text-accent mb-6">Safety Protocols</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {protocols.map((protocol, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                                {protocol}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 text-center not-prose">
                    <h4 className="text-primary font-bold mb-2">Transport Enquiry</h4>
                    <p className="text-sm text-slate-600 mb-6">Need to check bus routes for your area? Contact our transport desk.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <div className="flex items-center gap-2 text-primary font-bold">
                            <Phone className="w-4 h-4 text-secondary" /> +91 98765 43211
                        </div>
                        <div className="flex items-center gap-2 text-primary font-bold">
                            <Mail className="w-4 h-4 text-secondary" /> transport@mpkidsschool.edu.in
                        </div>
                    </div>
                </div>
            </div>
        </FacilityPageLayout>
    );
}
