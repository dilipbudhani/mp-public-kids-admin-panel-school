import { dbConnect } from "@/lib/mongodb";
import StaticPage from "@/models/StaticPage";
import SiteSettings from "@/models/SiteSettings";
import ApplyClient from "./ApplyClient";

export const metadata = {
    title: 'Apply Online | MP Kids School',
    description: 'Register for admission at MP Kids School. Start your journey with us today.',
};

export default async function ApplyPage() {
    await dbConnect();

    // Fetch page data from CMS
    const pageData = await StaticPage.findOne({ slug: 'admissions-apply' }).lean();
    const settingsData = await SiteSettings.findOne({ schoolIds: 'mp-kids-school' }).lean();

    // Serialize the data for client component
    const serializedData = pageData ? {
        ...pageData,
        _id: pageData._id?.toString(),
        createdAt: pageData.createdAt?.toISOString(),
        updatedAt: pageData.updatedAt?.toISOString(),
    } : null;

    const serializedSettings = settingsData ? {
        schoolName: settingsData.schoolName,
        contactEmail: settingsData.contactEmail,
        contactPhone: settingsData.contactPhone,
    } : null;

    return <ApplyClient pageData={serializedData as any} settingsData={serializedSettings} />;
}
