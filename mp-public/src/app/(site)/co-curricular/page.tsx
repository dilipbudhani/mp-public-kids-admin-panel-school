import React from "react";
import { dbConnect } from "@/lib/mongodb";
import StaticPage, { IStaticPage } from "@/models/StaticPage";
import { CoCurricularClient } from "./CoCurricularClient";

export const metadata = {
    title: "Beyond the Classroom | MP Public School",
    description: "Explore the wide array of co-curricular activities, clubs, and societies at MP Public School.",
};

export default async function CoCurricularPage() {
    await dbConnect();

    let pageData = await StaticPage.findOne({ slug: "co-curricular" }).lean() as IStaticPage | null;
    let serializedData = pageData ? JSON.parse(JSON.stringify(pageData)) : null;

    return <CoCurricularClient pageData={serializedData} />;
}
