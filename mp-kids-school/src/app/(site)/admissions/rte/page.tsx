import React from 'react';
import { Metadata } from 'next';
import RTEClient from './RTEClient';
import { dbConnect } from "@/lib/mongodb";
import StaticPage from "@/models/StaticPage";

export const metadata: Metadata = {
    title: 'RTE Admissions 2026-27 | MP Kids School',
    description: 'Apply for RTE (Right to Education) admissions at MP Kids School under Section 12(1)(c). 25% seats reserved for economically weaker sections and disadvantaged groups.',
    openGraph: {
        title: 'RTE Admissions 2026-27 | MP Kids School',
        description: 'Apply for RTE admissions at MP Kids School. Free quality education for EWS/SC/ST/OBC-NCL students.',
        type: 'website',
    }
};

export default async function RTEPage() {
    await dbConnect();
    const pageData = await StaticPage.findOne({ slug: "admissions-rte" }).lean();

    return <RTEClient pageData={JSON.parse(JSON.stringify(pageData))} />;
}
