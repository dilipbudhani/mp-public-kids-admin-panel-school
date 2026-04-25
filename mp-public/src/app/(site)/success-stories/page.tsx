import SuccessStoriesClient from "./SuccessStoriesClient";
import { dbConnect } from "@/lib/mongodb";
import SuccessStory from "@/models/SuccessStory";
import StaticPage from "@/models/StaticPage";
import Stat from "@/models/Stat";

async function getSuccessStories() {
    await dbConnect();
    const stories = await SuccessStory.find({ isActive: true, schoolIds: process.env.SCHOOL_ID }).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(stories));
}

async function getStats() {
    await dbConnect();
    const stats = await Stat.find({ isActive: true, schoolIds: process.env.SCHOOL_ID }).sort({ displayOrder: 1 }).limit(5).lean();
    return JSON.parse(JSON.stringify(stats));
}

async function getPageData() {
    await dbConnect();
    const page = await StaticPage.findOne({ slug: "success-stories", schoolIds: process.env.SCHOOL_ID }).lean();
    return page ? JSON.parse(JSON.stringify(page)) : null;
}

export default async function SuccessStoriesPage() {
    const [stories, stats, pageData] = await Promise.all([
        getSuccessStories(),
        getStats(),
        getPageData()
    ]);
    return <SuccessStoriesClient initialStories={stories} stats={stats} pageData={pageData} />;
}
