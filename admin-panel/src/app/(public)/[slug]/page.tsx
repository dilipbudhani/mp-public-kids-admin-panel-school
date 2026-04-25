import { dbConnect } from "@/lib/mongodb";
import Page from "@/models/Page";
import PublicRenderer from "@/components/public-sections/PublicRenderer";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";

interface PageProps {
    params: {
        slug: string;
    };
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    await dbConnect();

    // Fetch page by slug and published state
    const page = await Page.findOne({ slug, isDraft: false });

    if (!page) {
        notFound();
    }

    return (
        <div className="min-h-screen flex flex-col pt-20">
            <Navbar />
            <main className="flex-1">
                <PublicRenderer sections={page.sections as any} />
            </main>
            <Footer />
        </div>
    );
}
