import { dbConnect } from "@/lib/mongodb";
import Page from "@/models/Page";
import PublicRenderer from "@/components/public-sections/PublicRenderer";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";

export default async function HomePage() {
    await dbConnect();

    // Fetch home page (slug: 'home')
    const page = await Page.findOne({ slug: "home", isDraft: false });

    if (!page) {
        return (
            <div className="min-h-screen flex flex-col pt-20">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-playfair font-black text-slate-900 border-b-4 border-primary pb-2 inline-block">Welcome to MP Kids</h1>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Site is under construction</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
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
