import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { dbConnect } from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";

export default async function TestimonialsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    let settings = null;
    try {
        await dbConnect();
        const settingsData = await SiteSettings.findOne().lean();
        if (settingsData) {
            settings = JSON.parse(JSON.stringify(settingsData));
        }
    } catch (error) {
        console.error("Failed to fetch settings in layout:", error);
    }

    return (
        <>
            <Navbar settings={settings} />
            {children}
            <Footer settings={settings} />
            <FloatingActions settings={settings} />
        </>
    );
}
