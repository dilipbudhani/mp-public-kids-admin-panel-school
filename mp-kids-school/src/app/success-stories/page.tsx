import SuccessStoriesClient from "./SuccessStoriesClient";
import { dbConnect } from "@/lib/mongodb";
import SuccessStory from "@/models/SuccessStory";
import StaticPage from "@/models/StaticPage";

async function getSuccessStories() {
    await dbConnect();
    const stories = await SuccessStory.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(stories));
}

async function getPageData() {
    await dbConnect();
    const page = await StaticPage.findOne({ slug: "success-stories" }).lean();
    return page ? JSON.parse(JSON.stringify(page)) : null;
}

export default async function SuccessStoriesPage() {
    const [stories, pageData] = await Promise.all([
        getSuccessStories(),
        getPageData()
    ]);
    return <SuccessStoriesClient initialStories={stories} pageData={pageData} />;
}
