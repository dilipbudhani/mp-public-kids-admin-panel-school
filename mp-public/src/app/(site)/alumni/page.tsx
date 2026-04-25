import React from 'react';
import { Metadata } from 'next';
import AlumniClient from './AlumniClient';
import { dbConnect } from '@/lib/mongodb';
import Alumni from '@/models/Alumni';
import AlumniEvent from '@/models/AlumniEvent';
import AlumniTestimonial from '@/models/AlumniTestimonial';
import StaticPage from '@/models/StaticPage';
import Stat from '@/models/Stat';
import News from '@/models/News';

export const metadata: Metadata = {
    title: 'Alumni | MP Public School',
    description: 'Celebrating the legacy of MP Public School alumni. Join our growing network of 5000+ distinguished graduates making a difference across India and the world.',
    openGraph: {
        title: 'Alumni | MP Public School',
        description: 'Celebrating the legacy of MP Public School alumni. Join our growing network of 5000+ distinguished graduates.',
        type: 'website',
    }
};

async function getAlumni() {
    await dbConnect();
    const alumni = await Alumni.find({ isActive: true, schoolIds: process.env.SCHOOL_ID }).sort({ batch: -1, name: 1 }).lean();
    return JSON.parse(JSON.stringify(alumni)).map((a: any) => ({
        ...a,
        org: a.organization
    }));
}

async function getStats() {
    await dbConnect();
    const stats = await Stat.find({ isActive: true, schoolIds: process.env.SCHOOL_ID }).sort({ displayOrder: 1 }).limit(5).lean();
    return JSON.parse(JSON.stringify(stats));
}

async function getTestimonials() {
    await dbConnect();
    const testimonials = await AlumniTestimonial.find({ isActive: true, schoolIds: process.env.SCHOOL_ID }).sort({ displayOrder: 1 }).lean();
    return JSON.parse(JSON.stringify(testimonials));
}

async function getEvents() {
    await dbConnect();
    const events = await AlumniEvent.find({ isActive: true, schoolIds: process.env.SCHOOL_ID }).sort({ date: 1 }).lean();
    return JSON.parse(JSON.stringify(events));
}

async function getPageData() {
    await dbConnect();
    const pageData = await StaticPage.findOne({ slug: "alumni", schoolIds: process.env.SCHOOL_ID }).lean();
    const alumniStories = await News.find({
        schoolIds: process.env.SCHOOL_ID,
        category: "alumni",
        status: "published"
    }).sort({ date: -1 }).lean();
    return pageData ? JSON.parse(JSON.stringify({ ...pageData, alumniStories })) : null;
}

export default async function AlumniPage() {
    const [alumniData, stats, testimonials, events, pageData] = await Promise.all([
        getAlumni(),
        getStats(),
        getTestimonials(),
        getEvents(),
        getPageData()
    ]);

    return (
        <AlumniClient
            initialAlumni={alumniData}
            stats={stats}
            testimonials={testimonials}
            events={events}
            pageData={pageData}
        />
    );
}
