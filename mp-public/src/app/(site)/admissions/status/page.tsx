import { dbConnect } from "@/lib/mongodb";
import StaticPage from "@/models/StaticPage";
import StatusClient from "./StatusClient";

export const metadata = {
    title: 'Admission Status | MP Public School',
    description: 'Track your admission application status at MP Public School.',
};

export default async function StatusPage() {
    await dbConnect();

    // Fetch page data from CMS
    const pageData = await StaticPage.findOne({ slug: 'admissions-status' }).lean();

    // Serialize the data for client component
    const serializedData = pageData ? {
        ...pageData,
        _id: pageData._id?.toString(),
        createdAt: pageData.createdAt?.toISOString(),
        updatedAt: pageData.updatedAt?.toISOString(),
    } : null;

    return <StatusClient pageData={serializedData as any} />;
}
