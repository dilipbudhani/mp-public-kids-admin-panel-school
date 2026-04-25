import React from "react";
import { AboutPageLayout } from "@/components/about/AboutPageLayout";
import VisionMission from "@/components/about/VisionMission";
import { Target } from "lucide-react";
import { dbConnect } from "@/lib/mongodb";
import StaticPage from "@/models/StaticPage";

export const metadata = {
    title: "Vision & Mission | About Us | MP Kids School",
    description: "Our purpose is to be a global leader in education, fostering an environment where innovation, character, and academic excellence converge.",
};

export default async function AboutVisionPage() {
    await dbConnect();

    // Fetch page content from MongoDB
    const pageData = await StaticPage.findOne({ schoolIds: process.env.SCHOOL_ID, slug: "about-vision" }).lean();

    // Fallback/Default data
    const content = pageData || {
        title: "Vision & Mission",
        subtitle: "Our Purpose",
        description: "To be a global leader in education, fostering an environment where innovation, character, and academic excellence converge.",
        sections: [
            {
                title: "Our Vision",
                content: "To be a global leader in education, fostering an environment where innovation, character, and academic excellence converge to shape future leaders.",
                order: 0
            },
            {
                title: "Our Mission",
                content: "To provide a holistic CBSE-aligned education that empowers students with critical thinking, ethical values, and a lifelong passion for learning.",
                order: 1
            },
            {
                title: "Our Philosophy",
                content: "We believe in the unique potential of every child. Our student-centric approach ensures personal growth alongside academic success.",
                order: 2
            }
        ]
    };

    // Map sections to the format expected by VisionMission component
    const mappedValues = content.sections?.sort((a: any, b: any) => a.order - b.order).map((s: any, i: number) => ({
        title: s.title,
        description: s.content,
        icon: i === 0 ? 'Eye' : i === 1 ? 'Target' : 'Heart',
        color: i === 0 ? 'bg-primary' : i === 1 ? 'bg-accent' : 'bg-secondary'
    })) || [];

    return (
        <AboutPageLayout
            title={content.title}
            subtitle={content.subtitle || "Our Purpose"}
            description={content.description || ""}
            icon="target"
            image={(content as any).bannerImage}
        >
            <VisionMission values={mappedValues.length > 0 ? mappedValues : undefined} />
        </AboutPageLayout>
    );
}
