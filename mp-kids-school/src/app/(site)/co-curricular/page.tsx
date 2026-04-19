import React from "react";
import { dbConnect } from "@/lib/mongodb";
import StaticPage, { IStaticPage } from "@/models/StaticPage";
import { CoCurricularClient } from "./CoCurricularClient";

export const metadata = {
    title: "Beyond the Classroom | MP Kids School",
    description: "Explore the wide array of co-curricular activities, clubs, and societies at MP Kids School.",
};

export default async function CoCurricularPage() {
    await dbConnect();

    const pageData = await StaticPage.findOne({ slug: "co-curricular" }).lean() as IStaticPage | null;

    return <CoCurricularClient pageData={pageData} />;
}
