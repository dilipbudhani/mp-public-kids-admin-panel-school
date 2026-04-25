const mongoose = require('mongoose');
require('dotenv').config({ path: 'admin-panel/.env' });

async function updatePrograms() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const ProgramSchema = new mongoose.Schema({}, { strict: false });
        const Program = mongoose.model('Program', ProgramSchema, 'programs');

        // Clean existing programs that might conflict or just clear all for a fresh start if that's safer
        // Actually, let's just delete the old ones and insert the new ones.
        await Program.deleteMany({});
        console.log('Cleared existing programs');

        const schoolIds = ["mp-public", "mp-kids-school"];

        const programs = [
            {
                schoolIds,
                title: "Pre-Primary Wing",
                description: "Nursery to UKG - Nurturing young minds through play-based learning.",
                icon: "Baby",
                href: "/academics/pre-primary",
                color: "pink",
                displayOrder: 0,
                isActive: true
            },
            {
                schoolIds,
                title: "Primary Wing",
                description: "Standard I to V - Building strong foundational skills in core subjects.",
                icon: "BookOpen",
                href: "/academics/primary",
                color: "blue",
                displayOrder: 1,
                isActive: true
            },
            {
                schoolIds,
                title: "Middle Wing",
                description: "Standard VI to VIII - Fostering curiosity and critical thinking.",
                icon: "Users",
                href: "/academics/middle",
                color: "green",
                displayOrder: 2,
                isActive: true
            },
            {
                schoolIds,
                title: "Secondary Wing",
                description: "Standard IX to X - Preparing students for academic excellence.",
                icon: "GraduationCap",
                href: "/academics/secondary",
                color: "purple",
                displayOrder: 3,
                isActive: true
            },
            {
                schoolIds,
                title: "Senior Secondary Wing",
                description: "Standard XI to XII - Empowering students for higher education and leadership.",
                icon: "Award",
                href: "/academics/senior-secondary",
                color: "amber",
                displayOrder: 4,
                isActive: true
            }
        ];

        await Program.insertMany(programs);
        console.log('Added 5 academic wings successfully');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

updatePrograms();
