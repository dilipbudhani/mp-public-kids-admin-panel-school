import React from 'react';
import { dbConnect } from "@/lib/mongodb";
import StaticPage from "@/models/StaticPage";
import ResultsClient from "./ResultsClient";

export const metadata = {
    title: "Results | MP Kids School",
    description: "Academic achievements and topper profiles of MP Kids School.",
};

export default async function ResultsPage() {
    await dbConnect();
    const pageData = await StaticPage.findOne({ schoolIds: process.env.SCHOOL_ID, slug: "results" }).lean();

    // Serialize MongoDB objects for Client Component
    const serializedPageData = pageData ? JSON.parse(JSON.stringify(pageData)) : null;

    return <ResultsClient pageData={serializedPageData} />;
}
