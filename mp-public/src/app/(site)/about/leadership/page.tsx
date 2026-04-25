import React from "react";
import { AboutPageLayout } from "@/components/about/AboutPageLayout";
import Leadership from "@/components/about/Leadership";
import { dbConnect } from "@/lib/mongodb";
import Faculty from "@/models/Faculty";
import StaticPage from "@/models/StaticPage";

export const metadata = {
    title: "School Leadership | MP Public School",
    description: "Meet the visionary minds behind MP Public School. Our leadership team consists of dedicated educators and administrators with decades of experience.",
};

export default async function AboutLeadershipPage() {
    await dbConnect();

    const schoolId = process.env.SCHOOL_ID || "mp-public";

    // Fetch leadership team from Faculty model
    const [leadershipTeam, pageData] = await Promise.all([
        Faculty.find({
            schoolIds: schoolId,
            designation: { $in: [/Director/i, /Chairman/i, /Secretary/i, /Principal/i] }
        }).sort({ order: 1 }).lean(),
        StaticPage.findOne({ slug: "about-leadership", schoolIds: schoolId }).lean()
    ]);

    const content = {
        title: pageData?.title || "School Leadership",
        subtitle: pageData?.subtitle || "Our Mentors",
        description: pageData?.description || "Guided by visionaries and dedicated educators, MP Public School continues to scale new heights in pedagogical innovation.",
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
