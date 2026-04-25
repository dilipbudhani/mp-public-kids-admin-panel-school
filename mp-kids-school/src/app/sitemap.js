import { dbConnect } from '@/lib/mongodb';
import News from '@/models/News';

const BASE_URL = 'https://www.mpkidsschool.com';

export default async function sitemap() {
    await dbConnect();

    // Static routes
    const staticRoutes = [
        '',
        '/about',
        '/about/history',
        '/about/leadership',
        '/about/overview',
        '/about/principal',
        '/about/vision',
        '/academic-calendar',
        '/academics',
        '/academics/middle',
        '/academics/pre-primary',
        '/academics/primary',
        '/academics/secondary',
        '/academics/senior-secondary',
        '/achievements',
        '/admissions',
        '/alumni',
        '/careers',
        '/cbse-disclosure',
        '/co-curricular',
        '/contact',
        '/disclaimer',
        '/downloads',
        '/facilities',
        '/facilities/classrooms',
        '/facilities/computer-lab',
        '/facilities/library',
        '/facilities/science-labs',
        '/facilities/sports',
        '/facilities/transport',
        '/faculty',
        '/faqs',
        '/fee-structure',
        '/feedback',
        '/gallery',
        '/life-at-school',
        '/news',
        '/notices',
        '/privacy-policy',
        '/results',
        '/sitemap',
        '/terms',
        '/transport',
        '/virtual-tour',
    ].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic news routes
    const newsEntries = await News.find({ isPublished: true, schoolIds: process.env.SCHOOL_ID || 'mp-kids-school' })
        .select('slug updatedAt')
        .lean();

    const newsRoutes = newsEntries.map((news) => ({
        url: `${BASE_URL}/news/${news.slug}`,
        lastModified: news.updatedAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
    }));

    return [...staticRoutes, ...newsRoutes];
}
