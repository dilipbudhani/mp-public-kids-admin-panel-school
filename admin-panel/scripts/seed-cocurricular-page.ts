import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

import StaticPage from '../src/models/StaticPage';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env');
    process.exit(1);
}

const coCurricularPageData = {
    schoolIds: ['mp-kids-school'],
    title: "Beyond the Classroom",
    description: "We nurture hidden talents and build character through a rich spectrum of co-curricular activities, ensuring every student finds their passion.",
    subtitle: "Holistic Growth",
    slug: "co-curricular",
    sections: [
        {
            id: "clubs_societies",
            type: "standard",
            title: "Clubs & Societies",
            content: "Explore our diverse range of clubs designed to develop skills in art, tech, sports, and leadership."
        },
        {
            key: "activities",
            type: "grid",
            title: "Clubs & Activities List",
            items: [
                {
                    title: "Music Club",
                    icon: "Music",
                    content: "Vocal and instrumental training covering both Indian Classical and Western styles.",
                    age: "Class 3-12",
                    schedule: "Every Wed, 2:00-4:00 PM",
                    color: "bg-blue-500"
                },
                {
                    title: "Dance Academy",
                    icon: "Mic2",
                    content: "Fusion of Bharatanatyam, Kathak, and contemporary dance forms.",
                    age: "Class 1-12",
                    schedule: "Every Tue & Thu, 3:00-4:30 PM",
                    color: "bg-rose-500"
                },
                {
                    title: "Art & Craft",
                    icon: "Palette",
                    content: "Unleash creativity through painting, sculpture, and origami.",
                    age: "Class Nur-12",
                    schedule: "Every Mon, 2:30-4:00 PM",
                    color: "bg-amber-500"
                },
                {
                    title: "Robotics Club",
                    icon: "Cpu",
                    content: "Building and programming autonomous robots for real-world challenges.",
                    age: "Class 6-12",
                    schedule: "Every Fri, 2:00-5:00 PM",
                    color: "bg-slate-700"
                },
                {
                    title: "Debate Society",
                    icon: "MessageSquare",
                    content: "Enhancing public speaking and critical thinking through structured arguments.",
                    age: "Class 8-12",
                    schedule: "Every Sat, 10:00 AM-12:00 PM",
                    color: "bg-indigo-600"
                },
                {
                    title: "Science Club",
                    icon: "FlaskConical",
                    content: "Hands-on experiments and innovation projects beyond the curriculum.",
                    age: "Class 5-10",
                    schedule: "Every Wed, 3:00-4:30 PM",
                    color: "bg-emerald-600"
                },
                {
                    title: "NCC",
                    icon: "Flag",
                    content: "National Cadet Corps training for discipline, unity, and patriotism.",
                    age: "Class 9-12",
                    schedule: "Every Sat, 7:00-9:00 AM",
                    color: "bg-green-700"
                },
                {
                    title: "Scouts & Guides",
                    icon: "Compass",
                    content: "Outdoor skills and community service for younger students.",
                    age: "Class 4-8",
                    schedule: "Every Fri, 3:00-5:00 PM",
                    color: "bg-orange-600"
                },
                {
                    title: "Photography Club",
                    icon: "Camera",
                    content: "Mastering light, composition, and digital editing of visual stories.",
                    age: "Class 7-12",
                    schedule: "Every Tue, 3:30-5:00 PM",
                    color: "bg-pink-500"
                },
                {
                    title: "Chess Club",
                    icon: "Activity",
                    content: "Strategy and concentration sessions for beginners and masters.",
                    age: "Class 2-12",
                    schedule: "Every Mon & Wed, 3:00-4:00 PM",
                    color: "bg-zinc-800"
                },
                {
                    title: "Football Academy",
                    icon: "Trophy",
                    content: "Professional coaching focus on teamwork and physical endurance.",
                    age: "Class 5-12",
                    schedule: "Daily, 6:30-8:00 AM",
                    color: "bg-lime-600"
                },
                {
                    title: "Basketball",
                    icon: "Dribbble",
                    content: "Elite court training and inter-school tournament preparation.",
                    age: "Class 6-12",
                    schedule: "Mon to Fri, 4:00-6:00 PM",
                    color: "bg-orange-500"
                },
                {
                    title: "Yoga & Meditation",
                    icon: "Sun",
                    content: "Cultivating mental peace and physical flexibility through Asanas.",
                    age: "Class Nur-12",
                    schedule: "Daily, 8:00-8:30 AM",
                    color: "bg-yellow-500"
                },
                {
                    title: "Environmental Club",
                    icon: "Leaf",
                    content: "Promoting sustainability through gardening and conservation campaigns.",
                    age: "Class 4-10",
                    schedule: "Every Thu, 2:30-4:00 PM",
                    color: "bg-green-500"
                },
                {
                    title: "Literary Club",
                    icon: "BookOpen",
                    content: "Creative writing, poetry slams, and annual magazine production.",
                    age: "Class 6-12",
                    schedule: "Every Fri, 2:30-4:00 PM",
                    color: "bg-purple-600"
                }
            ]
        },
        {
            key: "achievements",
            type: "standard",
            title: "Achievements Reel",
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
};

async function seed() {
    try {
        console.log('Seeding Co-Curricular Page...');
        await mongoose.connect(MONGODB_URI as string);
        console.log('Connected to MongoDB');

        const existingItem = await StaticPage.findOne({ slug: coCurricularPageData.slug });

        if (existingItem) {
            console.log('Page already exists. Updating...');
            await StaticPage.updateOne({ _id: existingItem._id }, coCurricularPageData);
        } else {
            console.log('Creating new page...');
            await StaticPage.create(coCurricularPageData);
        }

        console.log('Successfully seeded Co-Curricular Page.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seed();
