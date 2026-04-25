import React from "react";
import { AboutPageLayout } from "@/components/about/AboutPageLayout";
import SchoolHistory from "@/components/about/History";
import { dbConnect } from "@/lib/mongodb";
import StaticPage from "@/models/StaticPage";

export const metadata = {
    title: "Our History & Legacy | About Us | MP Public School",
    description: "Discover the journey of MP Public School since its founding in 1995. A legacy built on academic excellence and holistic student development.",
};

export default async function AboutHistoryPage() {
    await dbConnect();

    const schoolId = process.env.SCHOOL_ID || "mp-public";

    // Fetch page content from MongoDB
    const pageData = await StaticPage.findOne({
        slug: "about-history",
        schoolIds: schoolId
    }).lean();

    // Default legacy image if not provided in DB
    const defaultLegacyImage = "https://images.unsplash.com/photo-1523050853063-91503ff44c06?q=80&w=2000";

    const content = pageData || {
        title: "Our History & Legacy",
        subtitle: "The MPKS Journey",
        description: "From a small cohort in 1995 to a leading CBSE institution, our journey has been defined by unwavering excellence.",
        sections: [
            {
                year: '1995',
                title: 'Founding Stone Laid',
                content: 'MP Public School was established with a small cohort of 50 students and a vision for holistic growth.',
                order: 0
            },
            {
                year: '2005',
                title: 'CBSE Secondary Affiliation',
                content: 'Received formal affiliation from CBSE for secondary classes, marking our first decade of excellence.',
                order: 1
            },
            {
                year: '2012',
                title: 'Senior Secondary Expansion',
                content: 'Inaugurated the senior secondary block with Science and Commerce streams.',
                order: 2
            },
            {
                year: '2020',
                title: 'Silver Jubilee & Tech Integration',
                content: 'Celebrated 25 years with a complete digital transformation of classrooms and labs.',
                order: 3
            },
            {
                year: '2025',
                title: 'New Modern Campus Wing',
                content: 'Opening of the state-of-the-art Research and Arts center to cater to 21st-century skills.',
                order: 4
            }
        ]
    };

    // Map sections to timeline format
    const timeline = content.sections?.sort((a: any, b: any) => a.order - b.order).map((s: any) => ({
        year: s.title.match(/\d{4}/)?.[0] || 'Year',
        event: s.title.replace(/\d{4}/, '').trim() || s.title,
        description: s.content
    })) || [];

    return (
        <AboutPageLayout
            title={content.title}
            subtitle={content.subtitle || "Our History"}
            description={content.description || ""}
            icon="history"
            image={(content as any).bannerImage}
        >
            <SchoolHistory
                timeline={timeline.length > 0 ? timeline : undefined}
                legacyImage={(content as any).bannerImage || defaultLegacyImage}
                legacyText={content.title}
            />
        </AboutPageLayout>
    );
}
