import React from "react";
import { AboutPageLayout } from "@/components/about/AboutPageLayout";
import Leadership from "@/components/about/Leadership";
import { Users } from "lucide-react";
import { dbConnect } from "@/lib/mongodb";
import Faculty from "@/models/Faculty";
import StaticPage from "@/models/StaticPage";

export const metadata = {
    title: "School Leadership | MP Kids School",
    description: "Meet the visionary minds behind MP Kids School. Our leadership team consists of dedicated educators and administrators with decades of experience.",
};

export default async function AboutLeadershipPage() {
    await dbConnect();

    // Fetch leadership team from Faculty model
    // We assume leadership roles include Principal, Director, Chairman, etc.
    const leadershipTeam = await Faculty.find({
        schoolIds: process.env.SCHOOL_ID,
        designation: { $in: [/Principal/i, /Director/i, /Chairman/i, /Founder/i, /Administrator/i] },
        isActive: true
    }).sort({ order: 1 }).lean();

    // Fetch page details from StaticPage if customized
    const pageData = await StaticPage.findOne({ schoolIds: process.env.SCHOOL_ID, slug: "about-leadership" }).lean();

    const content = {
        title: pageData?.title || "School Leadership",
        subtitle: pageData?.subtitle || "Our Mentors",
        description: pageData?.description || "Guided by visionaries and dedicated educators, MP Kids School continues to scale new heights in pedagogical innovation.",
        image: pageData?.bannerImage
    };

    // Map sections to leaders format if they exist
    const sectionsLeaders = pageData?.sections?.map((s: any) => ({
        name: s.title,
        role: s.subheading,
        bio: s.content,
        image: s.image
    }));

    const mappedLeaders = (sectionsLeaders && sectionsLeaders.length > 0)
        ? sectionsLeaders
        : (leadershipTeam.length > 0 ? leadershipTeam.map((leader: any) => ({
            name: leader.name,
            role: leader.designation,
            bio: leader.bio,
            image: leader.imageUrl
        })) : undefined);

    return (
        <AboutPageLayout
            title={content.title}
            subtitle={content.subtitle}
            description={content.description}
            icon="users"
            image={content.image}
        >
            <Leadership leaders={mappedLeaders} />
        </AboutPageLayout>
    );
}
