import { dbConnect } from "@/lib/mongodb";
import StaticPage from "@/models/StaticPage";
import ApplyClient from "./ApplyClient";

export const metadata = {
    title: 'Apply Online | MP Public School',
    description: 'Register for admission at MP Public School. Start your journey with us today.',
};

export default async function ApplyPage() {
    await dbConnect();

    // Fetch page data from CMS
    const pageData = await StaticPage.findOne({ slug: 'admissions-apply' }).lean();

    // Serialize the data for client component
    const serializedData = pageData ? {
        ...pageData,
        _id: pageData._id?.toString(),
        createdAt: pageData.createdAt?.toISOString(),
        updatedAt: pageData.updatedAt?.toISOString(),
    } : null;

    return <ApplyClient pageData={serializedData as any} />;
}
