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

        // 1. Admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.findOneAndUpdate(
            { email: 'admin@mpkidsschool.edu.in' },
            {
                email: 'admin@mpkidsschool.edu.in',
                password: hashedPassword,
                name: 'MP Kids Admin',
                role: 'admin'
            },
            { upsert: true, new: true }
        );
        console.log('Admin user seeded');

        // 2. Hero slides
        await HeroSlide.deleteMany({});
        await HeroSlide.insertMany([
            {
                title: "Nurturing Excellence, Inspiring",
                highlight: "Innovation",
                description: "Over 25 years of quality education with a holistic curriculum, state-of-the-art facilities, and a commitment to nurturing future leaders.",
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
            },
            {
                title: "Excellence in Every",
                highlight: "Endeavor",
                description: "Providing a world-class learning environment for intellectual growth and creative exploration.",
                badge: "State-of-the-art Campus",
                cta1Text: "Take a Tour",
                cta1Href: "/virtual-tour",
                cta2Text: "Our Facilities",
                cta2Href: "/facilities",
                imageUrl: "/images/hero-2.png",
                statValue: "100%",
                statLabel: "Result Track Record",
                displayOrder: 1,
                isActive: true,
            }
        ]);
        console.log('Hero slides seeded');

        // 3. Stats
        await Stat.deleteMany({});
        await Stat.insertMany([
            { label: "Students Enrolled", value: 1200, suffix: "+", displayOrder: 0, isActive: true },
            { label: "Expert Faculty", value: 85, suffix: "+", displayOrder: 1, isActive: true },
            { label: "State-of-the-art Labs", value: 12, suffix: "", displayOrder: 2, isActive: true },
            { label: "Years of Legacy", value: 25, suffix: "+", displayOrder: 3, isActive: true }
        ]);
        console.log('Stats seeded');

        // 4. About Preview Page Data
        await StaticPage.findOneAndUpdate(
            { slug: 'about-us' },
            {
                title: 'Welcome to MP Kids School',
                slug: 'about-us',
                content: 'MP Kids School has been a pioneer in quality education since 1995. Our commitment to excellence and holistic development has made us one of the most trusted names in the region.',
                sections: [
                    {
                        title: 'Our Journey',
                        content: 'From humble beginnings to a premier educational institute, our journey has been driven by passion and excellence.',
                        image: '/images/about-preview.jpg'
                    }
                ],
                isActive: true
            },
            { upsert: true }
        );
        console.log('About page data seeded');

        // 5. Academic Programs
        await Program.deleteMany({});
        await Program.insertMany([
            { title: "Primary Wing", description: "Standard I to V - Building strong foundations through playful learning.", icon: "BookOpen", href: "/academics/primary", color: "blue", displayOrder: 0, isActive: true },
            { title: "Middle Wing", description: "Standard VI to VIII - Fostering curiosity and independent thinking.", icon: "Users", href: "/academics/middle", color: "green", displayOrder: 1, isActive: true },
            { title: "Secondary Wing", description: "Standard IX & X - Academic rigor and preparation for board success.", icon: "Award", href: "/academics/secondary", color: "purple", displayOrder: 2, isActive: true },
            { title: "Sr. Secondary", description: "Standard XI & XII - Advanced specialization and career guidance.", icon: "ChevronRight", href: "/academics/senior-secondary", color: "orange", displayOrder: 3, isActive: true }
        ]);
        console.log('Academic programs seeded');

        // 6. Facilities
        await Facility.deleteMany({});
        await Facility.insertMany([
            { title: "Science Labs", description: "Advanced physics, chemistry, and biology laboratories.", icon: "beaker", image: "/images/lab.jpg", displayOrder: 0, isActive: true },
            { title: "Computer Lab", description: "Modern IT center with high-speed internet and latest software.", icon: "monitor", image: "/images/computer-lab.jpg", displayOrder: 1, isActive: true },
            { title: "Library", description: "Spacious library with over 10,000 books and digital resources.", icon: "library", image: "/images/library.jpg", displayOrder: 2, isActive: true }
        ]);
        console.log('Facilities seeded');

        // 7. Testimonials
        await Testimonial.deleteMany({});
        await Testimonial.insertMany([
            { name: "Suresh Gupta", role: "Parent", content: "The level of individual attention my child receives at MPPS is truly commendable.", rating: 5, isActive: true, displayOrder: 0 },
            { name: "Ananya Sharma", role: "Class 12 Student", content: "The support from teachers and the competitive environment helped me excel in boards.", rating: 5, isActive: true, displayOrder: 1 }
        ]);
        console.log('Testimonials seeded');

        // 8. News
        await News.deleteMany({});
        await News.insertMany([
            { title: "CBSE Board Results 2026", slug: "cbse-board-results-2026", category: "Results", date: new Date(), summary: "MPPS students shine again with 100% result in Class 10th and 12th board exams.", content: "Full content about academic success...", imageUrl: "/images/news-1.jpg", isFeatured: true, isPublished: true },
            { title: "Inter-School Sports Meet", slug: "inter-school-sports-meet", category: "Sports", date: new Date(), summary: "Our athletes won 15 gold medals in the regional sports championship.", content: "Full content about sports victory...", imageUrl: "/images/news-2.jpg", isFeatured: false, isPublished: true }
        ]);
        console.log('News seeded');

        // 9. Events
        await SchoolEvent.deleteMany({});
        await SchoolEvent.insertMany([
            { title: "Annual Day Function", date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), category: "Cultural", content: "Join us for our mega cultural event showcasing student talent.", isActive: true },
            { title: "Science Exhibition", date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), category: "Academic", content: "Innovative projects by students across all wings.", isActive: true }
        ]);
        console.log('Events seeded');

        // 10. Circulars/Notices
        await Circular.deleteMany({});
        await Circular.insertMany([
            { title: "Summer Vacation Schedule", date: new Date(), category: "Holiday", description: "The school will remain closed for summer break from May 15th to June 30th.", fileUrl: "/files/vacation.pdf", isActive: true },
            { title: "New Uniform Guidelines", date: new Date(), category: "General", description: "Revised dress code for the upcoming academic session has been released.", isActive: true }
        ]);
        console.log('Circulars seeded');

        // 11. Site Settings
        await SiteSettings.findOneAndUpdate(
            { _id: 'global' },
            {
                _id: 'global',
                schoolName: 'MP Kids School',
                contactEmail: 'info@mpkidsschool.edu.in',
                contactPhone: '+91 12345 67890',
                address: 'Main Road, Block C, Education Hub, State 123456',
                facebookUrl: 'https://facebook.com/mpkidsschool',
                instagramUrl: 'https://instagram.com/mpkidsschool',
                twitterUrl: 'https://twitter.com/mpkidsschool',
                youtubeUrl: 'https://youtube.com/mpkidsschool',
                admissionOpen: true,
                whatsappNumber: '911234567890'
            },
            { upsert: true }
        );
        console.log('Site settings seeded');

        // 12. Gallery Items
        await Gallery.deleteMany({});
        await Gallery.insertMany([
            { title: "Campus View", imageUrl: "/images/gallery-1.jpg", publicId: "gallery-1", category: "Campus", type: "image", date: new Date() },
            { title: "Sports Day", imageUrl: "/images/gallery-2.jpg", publicId: "gallery-2", category: "Sports", type: "image", date: new Date() },
            { title: "Classroom Activity", imageUrl: "/images/gallery-3.jpg", publicId: "gallery-3", category: "Academics", type: "image", date: new Date() },
            { title: "Annual Function", imageUrl: "/images/gallery-4.jpg", publicId: "gallery-4", category: "Events", type: "image", date: new Date() },
            { title: "Science Lab", imageUrl: "/images/gallery-5.jpg", publicId: "gallery-5", category: "Academics", type: "image", date: new Date() },
            { title: "Library", imageUrl: "/images/gallery-6.jpg", publicId: "gallery-6", category: "Campus", type: "image", date: new Date() }
        ]);
        console.log('Gallery seeded');

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
