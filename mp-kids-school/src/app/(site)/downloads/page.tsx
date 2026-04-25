import React from "react";
import { dbConnect } from "@/lib/mongodb";
import StaticPage from "@/models/StaticPage";
import DownloadsClient from "./DownloadsClient";

export const metadata = {
    title: "Downloads | MP Kids School",
    description: "Access important school documents, forms, and circulars.",
};

export default async function DownloadsPage() {
    await dbConnect();
    const pageData = await StaticPage.findOne({ schoolIds: process.env.SCHOOL_ID, slug: "downloads" }).lean();

    // Serialize for Client Component
    const serializedPageData = pageData ? JSON.parse(JSON.stringify(pageData)) : null;

    return <DownloadsClient pageData={serializedPageData} />;
}
