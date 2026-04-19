import React from 'react';
import { Metadata } from 'next';
import CareersClient from './CareersClient';
import { dbConnect } from '@/lib/mongodb';
import Job from '@/models/Job';
import StaticPage from '@/models/StaticPage';

export const metadata: Metadata = {
    title: 'Careers | MP Public School',
    description: 'Join the MP Public School team. Explore open teaching and non-teaching positions and be part of a passionate team shaping the future of education.',
    openGraph: {
        title: 'Careers | MP Public School',
        description: 'Join the MP Public School team. Explore open positions in teaching, administration, and more.',
        type: 'website',
    }
};

async function getJobs() {
    await dbConnect();
    const jobs = await Job.find({ isActive: true, schoolIds: process.env.SCHOOL_ID }).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(jobs));
}

async function getPageData() {
    await dbConnect();
    const pageData = await StaticPage.findOne({ slug: "careers", schoolIds: process.env.SCHOOL_ID }).lean();
    return pageData ? JSON.parse(JSON.stringify(pageData)) : null;
}

export default async function CareersPage() {
    const jobsData = await getJobs();
    const pageData = await getPageData();
    return <CareersClient initialJobs={jobsData} pageData={pageData} />;
}
