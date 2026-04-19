import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import StaticPage from '../src/models/StaticPage';

// Load environment variables
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

async function main() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI as string);
        console.log('Connected successfully');

        const pages = [
            {
                slug: 'results',
                title: 'Academic Hall of Fame',
                description: 'Consistent Excellence in Every Endeavor',
                subtitle: 'Results & Achievements',
                sections: [
                    {
                        title: 'Beyond the Campus',
                        content: "Our students consistently find placement in the world's leading universities, carrying the values of MP Kids School across the globe.",
                        order: 0
                    }
                ]
            },
            {
                slug: 'downloads',
                title: 'Downloads & Resources',
                description: 'Find and download all essential admission forms, academic resources, circulars, and syllabi from our centralized repository.',
                subtitle: 'Repository',
                sections: [
                    {
                        title: 'Support',
                        content: "If a specific form or document is not available here, please reach out to our administrative office for assistance.",
                        order: 0
                    }
                ]
            },
            {
                slug: 'academic-calendar',
                title: 'Academic Calendar',
                description: 'Our yearly roadmap for learning, celebrations, and achievements.',
                subtitle: 'Calendar'
            },
            {
                slug: 'cbse-disclosure',
                title: 'Mandatory Public Disclosure',
                description: 'Appendix IX | CBSE Affiliation Norms and School Transparency Data',
                subtitle: 'Compliance & Transparency',
                sections: [
                    {
                        title: 'Official School Record',
                        content: 'As per CBSE Circular No. CBSE/Aff./4/2021',
                        order: 0
                    }
                ]
            },
            {
                slug: 'about-overview',
                title: 'Overview of Excellence',
                description: 'Founded in 1995, MP Kids School has been a beacon of quality education, blending traditional values with modern innovation.',
                subtitle: 'Who We Are',
                sections: [
                    {
                        title: 'Our Identity',
                        content: 'MP Kids School is more than just a school; it is a community dedicated to the holistic development of every child.',
                        order: 0
                    }
                ]
            },
            {
                slug: 'about-leadership',
                title: 'Messages from Leadership',
                description: 'Empowering young minds through visionary leadership and a commitment to academic excellence.',
                subtitle: 'From the Desk'
            },
            {
                slug: 'about-history',
                title: 'Our History & Legacy',
                description: 'From a small cohort in 1995 to a leading CBSE institution, our journey has been defined by unwavering excellence.',
                subtitle: 'The MPKS Journey'
            },
            {
                slug: 'about-vision',
                title: 'Vision & Mission',
                description: 'To be a global leader in education, fostering an environment where innovation, character, and academic excellence converge.',
                subtitle: 'Our Purpose'
            },
            {
                slug: 'faculty',
                title: 'Our Exceptional Faculty',
                description: 'Meeting the minds behind our students success. A team of dedicated educators committed to nurturing the next generation.',
                subtitle: 'Academic Team'
            },
            {
                slug: 'alumni',
                title: 'Our Alumni Global Network',
                description: 'Celebrating the legacy of MP Kids School. Our graduates are making a difference across India and the world.',
                subtitle: 'Legacy of Excellence'
            },
            {
                slug: 'careers',
                title: 'Working With Us',
                description: 'Join a passionate team dedicated to shaping the future of education. Explore opportunities at MP Kids School.',
                subtitle: 'Join Our Team'
            },
            {
                slug: 'testimonials',
                title: 'Voice of our Community',
                description: 'Hear from the parents, students, and alumni who make MP Kids School a vibrant community of learners.',
                subtitle: 'Success Stories'
            },
            {
                slug: 'success-stories',
                title: 'Legacy of Achievement',
                description: 'Discover the remarkable journeys of our students and the milestones that define MP Kids School.',
                subtitle: 'Beyond Academic'
            },
            {
                slug: 'admissions-rte',
                title: 'RTE Admissions 2026-27',
                description: 'Providing quality education under Section 12(1)(c) of the Right to Education Act, 2009.',
                subtitle: 'Right to Education',
                sections: [
                    {
                        title: 'What is the RTE Act?',
                        content: 'The Right of Children to Free and Compulsory Education (RTE) Act, 2009 is a landmark legislation that makes free and compulsory education a fundamental right for all children between the ages of 6 and 14 years in India.',
                        order: 0
                    }
                ]
            },
            {
                slug: 'admissions-status',
                title: 'Check Admission Status',
                description: "Stay updated on your child's journey. Enter the application number provided during registration to check the current status.",
                subtitle: 'Track Application'
            },
            {
                slug: 'admissions-apply',
                title: 'Student Registration',
                description: 'Complete the form below to initiate the admission process for the academic session 2026-27.',
                subtitle: 'Apply Online'
            },
            {
                slug: 'facilities',
                title: 'World-Class Facilities',
                description: 'State-of-the-art infrastructure designed to foster holistic learning and development.',
                subtitle: 'Campus Life',
                sections: [
                    {
                        key: 'overview',
                        title: 'The Pillars of Our Hub',
                        content: 'Our campus is built on the philosophy that environment shapes growth. Every corner of MP Kids School is designed to inspire curiosity and facilitate innovation.',
                        order: 0
                    },
                    {
                        key: 'pillars',
                        title: 'Core Infrastructure Pillars',
                        items: [
                            { title: "Science Hub", description: "Integrated labs for Physics, Chemistry, and Biology.", icon: "FlaskConical", color: "bg-blue-50 text-blue-600" },
                            { title: "Digital Labs", description: "Next-gen computer labs with AI and coding kits.", icon: "Laptop", color: "bg-indigo-50 text-indigo-600" },
                            { title: "Knowledge Center", description: "A library with over 20,000 titles and digital access.", icon: "Library", color: "bg-amber-50 text-amber-600" },
                            { title: "Sports Arena", description: "International standard track and indoor complex.", icon: "Trophy", color: "bg-emerald-50 text-emerald-600" },
                            { title: "Transport", description: "GPS-tracked AC bus fleet covering the entire city.", icon: "Bus", color: "bg-rose-50 text-rose-600" },
                            { title: "Smart Classes", description: "Interactive boards and AR/VR learning modules.", icon: "Building2", color: "bg-gold/10 text-gold" },
                        ],
                        order: 1
                    },
                    {
                        key: 'checklist',
                        title: 'Hub Checklist',
                        items: [
                            { title: "Smart Classrooms in Every Wing" },
                            { title: "Eco-friendly Solar Powered Campus" },
                            { title: "CCTV Secured Learning Spaces" },
                            { title: "Fully WiFi Enabled Block" }
                        ],
                        order: 2
                    }
                ]
            },
            {
                slug: 'facilities-library',
                title: 'The Knowledge Hub',
                description: 'A vast collection of resources extending beyond textbooks to spark imagination and research.',
                subtitle: 'School Library',
                bannerImage: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2000&auto=format&fit=crop",
                content: [
                    {
                        type: "html",
                        body: "<p>The library at MP Kids School is more than just a room full of books. It is a modern resource center equipped with digital archives, quiet reading zones, and collaborative spaces designed to inspire scholarly pursuit.</p>"
                    }
                ],
                sections: [
                    {
                        key: "collections",
                        title: "Library Collections",
                        items: [
                            { title: "20,000+ Print Volumes", description: "Extensive collection spanning fiction, non-fiction, academic journals, and regional literature.", icon: "BookOpen" },
                            { title: "Digital Archives", description: "Subscription to global e-libraries like JSTOR and Britannica for advanced research.", icon: "Search" }
                        ]
                    },
                    {
                        key: "core_facilities",
                        title: "Core Facilities",
                        items: [
                            { title: "Quiet Study Zones for Individual Work" },
                            { title: "Collaborative Learning Booths" },
                            { title: "Kindle & E-Reader Lending Section" },
                            { title: "Reference Section with Rare Manuscripts" },
                            { title: "Storytelling Corner for Lower Grades" },
                            { title: "Online Public Access Catalog (OPAC)" }
                        ]
                    }
                ]
            },
            {
                slug: 'facilities-sports',
                title: 'Sports & Physical Excellence',
                description: 'Nurturing champions and fostering teamwork through professional-grade sports infrastructure.',
                subtitle: 'Physical Education',
                bannerImage: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2000&auto=format&fit=crop",
                content: [
                    {
                        type: "html",
                        body: "<p>MP Kids School offers world-class sports infrastructure that caters to a wide variety of indoor and outdoor activities. Our professional coaching staff ensures that students can pursue their passion for sports at competitive levels.</p>"
                    }
                ],
                sections: [
                    {
                        key: "core_sports",
                        title: "Core Sports",
                        items: [
                            { title: "Basketball", description: "Standard courts", icon: "Target" },
                            { title: "Football", description: "Natural turf field", icon: "Users" },
                            { title: "Swimming", description: "Olympic size pool", icon: "Users" },
                            { title: "Athletics", description: "All-weather track", icon: "Dumbbell" }
                        ]
                    },
                    {
                        key: "infrastructure_details",
                        title: "Infrastructure Details",
                        items: [
                            { title: "Multi-purpose Indoor Sports Hall" },
                            { title: "Tournament-level Cricket Practice Nets" },
                            { title: "Fully-equipped Fitness & Yoga Studio" },
                            { title: "Table Tennis & Chess Arenas" },
                            { title: "Floodlight facility for evening training" },
                            { title: "Professional-grade Skating Rink" }
                        ]
                    }
                ]
            },
            {
                slug: 'co-curricular',
                title: 'Beyond the Classroom',
                description: 'Exploring talents and building character through a wide array of co-curricular activities.',
                subtitle: 'Holistic Growth',
                sections: [
                    {
                        key: 'club',
                        title: 'Our Clubs',
                        content: 'From Robotics to Classical Dance, our clubs provide a platform for every student to discover their passion.',
                        order: 0
                    },
                    {
                        key: "activities",
                        title: "Activities list",
                        items: [
                            { name: "Music Club", icon: "Music", desc: "Vocal and instrumental training covering both Indian Classical and Western styles.", age: "Class 3-12", schedule: "Every Wed, 2:00-4:00 PM", color: "bg-blue-500" },
                            { name: "Dance Academy", icon: "Mic2", desc: "Fusion of Bharatanatyam, Kathak, and contemporary dance forms.", age: "Class 1-12", schedule: "Every Tue & Thu, 3:00-4:30 PM", color: "bg-rose-500" },
                            { name: "Art & Craft", icon: "Palette", desc: "Unleash creativity through painting, sculpture, and origami.", age: "Class Nur-12", schedule: "Every Mon, 2:30-4:00 PM", color: "bg-amber-500" },
                            { name: "Robotics Club", icon: "Cpu", desc: "Building and programming autonomous robots for real-world challenges.", age: "Class 6-12", schedule: "Every Fri, 2:00-5:00 PM", color: "bg-slate-700" },
                            { name: "Debate Society", icon: "MessageSquare", desc: "Enhancing public speaking and critical thinking through structured arguments.", age: "Class 8-12", schedule: "Every Sat, 10:00 AM-12:00 PM", color: "bg-indigo-600" },
                            { name: "Science Club", icon: "FlaskConical", desc: "Hands-on experiments and innovation projects beyond the curriculum.", age: "Class 5-10", schedule: "Every Wed, 3:00-4:30 PM", color: "bg-emerald-600" },
                            { name: "NCC", icon: "Flag", desc: "National Cadet Corps training for discipline, unity, and patriotism.", age: "Class 9-12", schedule: "Every Sat, 7:00-9:00 AM", color: "bg-green-700" },
                            { name: "Scouts & Guides", icon: "Compass", desc: "Outdoor skills and community service for younger students.", age: "Class 4-8", schedule: "Every Fri, 3:00-5:00 PM", color: "bg-orange-600" },
                            { name: "Photography Club", icon: "Camera", desc: "Mastering light, composition, and digital editing of visual stories.", age: "Class 7-12", schedule: "Every Tue, 3:30-5:00 PM", color: "bg-pink-500" },
                            { name: "Chess Club", icon: "Activity", desc: "Strategy and concentration sessions for beginners and masters.", age: "Class 2-12", schedule: "Every Mon & Wed, 3:00-4:00 PM", color: "bg-zinc-800" },
                            { name: "Football Academy", icon: "Trophy", desc: "Professional coaching focus on teamwork and physical endurance.", age: "Class 5-12", schedule: "Daily, 6:30-8:00 AM", color: "bg-lime-600" },
                            { name: "Basketball", icon: "Dribbble", desc: "Elite court training and inter-school tournament preparation.", age: "Class 6-12", schedule: "Mon to Fri, 4:00-6:00 PM", color: "bg-orange-500" },
                            { name: "Yoga & Meditation", icon: "Sun", desc: "Cultivating mental peace and physical flexibility through Asanas.", age: "Class Nur-12", schedule: "Daily, 8:00-8:30 AM", color: "bg-yellow-500" },
                            { name: "Environmental Club", icon: "Leaf", desc: "Promoting sustainability through gardening and conservation campaigns.", age: "Class 4-10", schedule: "Every Thu, 2:30-4:00 PM", color: "bg-green-500" },
                            { name: "Literary Club", icon: "BookOpen", desc: "Creative writing, poetry slams, and annual magazine production.", age: "Class 6-12", schedule: "Every Fri, 2:30-4:00 PM", color: "bg-purple-600" }
                        ]
                    },
                    {
                        key: "achievements",
                        title: "Achievements Ticker",
                        items: [
                            { title: "Robotics Club won State Championship 2024" },
                            { title: "Debate team runners-up National Level" },
                            { title: "U-17 Football Team won Inter-School Trophy" },
                            { title: "Photography Club exhibition at City Art Gallery" },
                            { title: "Chess team qualified for Zonal level masters" },
                            { title: "Eco Club received 'Green School' certificate" },
                            { title: "Music Group won 1st Prize in State Harmony Meet" }
                        ]
                    }
                ]
            },
            {
                slug: 'gallery-page',
                title: 'Capturing Moments',
                description: 'A visual journey through school life, celebrations, and achievements.',
                subtitle: 'Media Gallery'
            },
            {
                slug: 'notices-page',
                title: 'Notices & Circulars',
                description: 'Stay informed with the latest updates, event schedules, and important announcements.',
                subtitle: 'Stay Updated'
            },
            {
                slug: 'fee-structure',
                title: 'Fee Structure 2025-26',
                description: 'We believe in complete transparency regarding school costs. Our fee structure reflects the quality of education and facilities provided.',
                subtitle: 'Investment in Excellence'
            }
        ];

        for (const page of pages) {
            await StaticPage.findOneAndUpdate(
                { slug: page.slug },
                {
                    $setOnInsert: page,
                    // If you want to force set these values even if they exist, use $set instead of $setOnInsert
                    // But for initial seeding, $setOnInsert is safer if they already customized it.
                    // However, to satisfy "impliment that i can edit", we should ensure these entries exist.
                },
                { upsert: true, new: true }
            );
            console.log(`Page seeded/verified: ${page.slug}`);
        }

        console.log('Seed wrappers completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
}

main();
