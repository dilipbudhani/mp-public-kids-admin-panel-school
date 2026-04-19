import React from "react";
import { AboutPageLayout } from "@/components/about/AboutPageLayout";
import Leadership from "@/components/about/Leadership";
import { Users } from "lucide-react";
import { dbConnect } from "@/lib/mongodb";
import Faculty from "@/models/Faculty";
import StaticPage from "@/models/StaticPage";

export const metadata = {
    title: "School Leadership | MP Public School",
    description: "Meet the visionary minds behind MP Public School. Our leadership team consists of dedicated educators and administrators with decades of experience.",
};

export default async function AboutLeadershipPage() {
    await dbConnect();

    // Fetch leadership team from Faculty model
    // We assume leadership roles include Principal, Director, Chairman, etc.
    const [leadershipTeam, pageData] = await Promise.all([
        Faculty.find({
            schoolIds: process.env.SCHOOL_ID,
            designation: { $in: [/Director/i, /Chairman/i, /Secretary/i, /Principal/i] }
        }).sort({ order: 1 }).lean(),
        StaticPage.findOne({ slug: "leadership-team", schoolIds: process.env.SCHOOL_ID }).lean()
    ]);

    const content = {
        title: pageData?.title || "School Leadership",
        subtitle: pageData?.subtitle || "Our Mentors",
        description: pageData?.description || "Guided by visionaries and dedicated educators, MP Public School continues to scale new heights in pedagogical innovation.",
        image: pageData?.bannerImage
    };

    const mappedLeaders = leadershipTeam.length > 0 ? leadershipTeam.map((leader: any) => ({
        name: leader.name,
        role: leader.designation,
        bio: leader.bio,
        image: leader.imageUrl
    })) : undefined;

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
