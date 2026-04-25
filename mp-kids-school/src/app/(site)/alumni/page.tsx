import React from 'react';
import { Metadata } from 'next';
import AlumniClient from './AlumniClient';
import { dbConnect } from '@/lib/mongodb';
import Alumni from '@/models/Alumni';
import StaticPage from '@/models/StaticPage';

export const metadata: Metadata = {
    title: 'Alumni | MP Kids School',
    description: 'Celebrating the legacy of MP Kids School alumni. Join our growing network of 5000+ distinguished graduates making a difference across India and the world.',
    openGraph: {
        title: 'Alumni | MP Kids School',
        description: 'Celebrating the legacy of MP Kids School alumni. Join our growing network of 5000+ distinguished graduates.',
        type: 'website',
    }
};

async function getAlumni() {
    await dbConnect();
    const alumni = await Alumni.find({ isActive: true, schoolIds: process.env.SCHOOL_ID }).sort({ batch: -1, name: 1 }).lean();
    return JSON.parse(JSON.stringify(alumni));
}

async function getPageData() {
    await dbConnect();
    const pageData = await StaticPage.findOne({ slug: "alumni", schoolIds: process.env.SCHOOL_ID }).lean();
    return pageData ? JSON.parse(JSON.stringify(pageData)) : null;
}

export default async function AlumniPage() {
    const alumniData = await getAlumni();
    const pageData = await getPageData();
    return <AlumniClient initialAlumni={alumniData} pageData={pageData} />;
}
