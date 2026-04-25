import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

// Import models
import User from '../src/models/User';
import HeroSlide from '../src/models/HeroSlide';
import Stat from '../src/models/Stat';
import Testimonial from '../src/models/Testimonial';
import News from '../src/models/News';
import SchoolEvent from '../src/models/SchoolEvent';
import Circular from '../src/models/Circular';
import Program from '../src/models/Program';
import Facility from '../src/models/Facility';
import SiteSettings from '../src/models/SiteSettings';
import Gallery from '../src/models/Gallery';
import StaticPage from '../src/models/StaticPage';

async function main() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI as string);
        console.log('Connected successfully');

        // 1. Admin users
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.deleteMany({});
        await User.insertMany([
            {
                email: 'admin@mppublicschool.edu.in',
                password: hashedPassword,
                name: 'MP Public Admin',
                role: 'admin'
            },
            {
                email: 'admin@mpkidsschool.edu.in',
                password: hashedPassword,
                name: 'MP Kids Admin',
                role: 'admin'
            }
        ]);
        console.log('Admin users seeded');

        // 2. Hero slides
        await HeroSlide.deleteMany({});
        await HeroSlide.insertMany([
            {
                schoolIds: ['mp-public'],
                title: "Experience Academic Excellence",
                highlight: "Since 1995",
                description: "Over 25 years of quality education with a holistic curriculum and state-of-the-art facilities.",
                badge: "Admissions Open 2026-27",
                cta1Text: "Apply Now",
                cta1Href: "/admissions",
                cta2Text: "Learn More",
                cta2Href: "/about",
                imageUrl: "/images/hero.png",
                statValue: "30+",
                statLabel: "Years of Excellence",
                displayOrder: 0,
                isActive: true,
            },
            {
                schoolIds: ['mp-kids-school'],
                title: "Nurturing Excellence, Inspiring",
                highlight: "Innovation",
                description: "Over 25 years of quality education with a holistic curriculum specifically designed for young minds.",
                badge: "Admissions Open 2026-27",
                cta1Text: "Apply Online Now",
                cta1Href: "/admissions",
                cta2Text: "Learn More About Us",
                cta2Href: "/about",
                imageUrl: "/images/hero.png",
                statValue: "25+",
                statLabel: "Years of Legacy",
                displayOrder: 0,
                isActive: true,
            }
        ]);
        console.log('Hero slides seeded');

        // 3. Stats
        await Stat.deleteMany({});
        await Stat.insertMany([
            { schoolIds: ['mp-public'], label: "Students Enrolled", value: 2500, suffix: "+", displayOrder: 0, isActive: true },
            { schoolIds: ['mp-public'], label: "Expert Faculty", value: 150, suffix: "+", displayOrder: 1, isActive: true },
            { schoolIds: ['mp-kids-school'], label: "Students", value: 1200, suffix: "+", displayOrder: 0, isActive: true },
            { schoolIds: ['mp-kids-school'], label: "Teachers", value: 85, suffix: "+", displayOrder: 1, isActive: true }
        ]);
        console.log('Stats seeded');

        // 4. Static Pages (Comprehensive List)
        await StaticPage.deleteMany({});
        const commonPages = [
            { slug: 'about-overview', title: 'Overview of Excellence', subtitle: 'Who We Are' },
            { slug: 'about-vision', title: 'Vision & Mission', subtitle: 'Our Purpose' },
            { slug: 'about-history', title: 'Our History', subtitle: 'The Journey' },
            { slug: 'about-principal', title: "Principal's Message", subtitle: 'Leading with Vision' },
            { slug: 'about-leadership', title: 'Our Leadership', subtitle: 'The Management' },
            { slug: 'academic-calendar', title: 'Academic Calendar', subtitle: 'Plan Your Year' },
            { slug: 'fee-structure', title: 'Fee Structure', subtitle: 'Investment in Future' },
            { slug: 'cbse-disclosure', title: 'CBSE Mandatory Disclosure', subtitle: 'Transparency' },
            { slug: 'admissions', title: 'Admissions Overview', subtitle: 'Join Us' },
            { slug: 'facilities', title: 'Our Facilities', subtitle: 'Modern Campus' },
            { slug: 'gallery', title: 'School Gallery', subtitle: 'Life at School' },
            { slug: 'news', title: 'News & Updates', subtitle: 'Latest Happenings' },
            { slug: 'notices', title: 'Notice Board', subtitle: 'Important Circulars' }
        ];

        const pagesToInsert: any[] = [];
        ['mp-public', 'mp-kids-school'].forEach(schoolId => {
            commonPages.forEach(p => {
                pagesToInsert.push({
                    schoolIds: [schoolId],
                    title: `${p.title} - ${schoolId === 'mp-public' ? 'MP Public' : 'MP Kids'}`,
                    slug: p.slug,
                    subtitle: p.subtitle,
                    content: `Welcome to the ${p.title} page of ${schoolId === 'mp-public' ? 'MP Public School' : 'MP Kids School'}. This content is dynamically managed via the Admin Panel.`,
                    isActive: true,
                    sections: []
                });
            });
        });

        await StaticPage.insertMany(pagesToInsert);
        console.log(`Seeded ${pagesToInsert.length} static pages`);

        // 5. Academic Programs
        await Program.deleteMany({});
        await Program.insertMany([
            { schoolIds: ['mp-public', 'mp-kids-school'], title: "Primary Wing", description: "Standard I to V - Building strong foundations.", icon: "BookOpen", href: "/academics/primary", color: "blue", displayOrder: 0, isActive: true },
            { schoolIds: ['mp-public', 'mp-kids-school'], title: "Middle Wing", description: "Standard VI to VIII - Fostering curiosity.", icon: "Users", href: "/academics/middle", color: "green", displayOrder: 1, isActive: true }
        ]);
        console.log('Academic programs seeded');

        // 6. Site Settings
        await SiteSettings.deleteMany({});
        await SiteSettings.insertMany([
            {
                _id: 'mp-public',
                schoolName: 'MP Public School',
                contactEmail: 'info@mppublicschool.edu.in',
                contactPhone: '+91 11223 34455',
                address: 'Sector 10, Public Colony',
                admissionOpen: true,
                whatsappNumber: '911122334455'
            },
            {
                _id: 'mp-kids-school',
                schoolName: 'MP Kids School',
                contactEmail: 'info@mpkidsschool.edu.in',
                contactPhone: '+91 12345 67890',
                address: 'Main Road, Block C',
                admissionOpen: true,
                whatsappNumber: '911234567890'
            }
        ]);
        console.log('Site settings seeded');

        console.log('Seed completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
}

main();
