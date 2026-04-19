import mongoose from "mongoose";
import dotenv from "dotenv";
import SuccessStory from "../src/models/SuccessStory";

dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Please define the MONGODB_URI environment variable");
    process.exit(1);
}

const stories = [
    {
        name: "Aarav Sharma",
        batch: "2023",
        category: "IIT/NIT",
        headline: "Secured AIR 452 in JEE Advanced",
        summary: "Aarav's journey from a curious student to an IITian is a testament to his hard work and the school's guidance.",
        story: "Aarav joined MP Kids School in Class 6. He was always interested in Mathematics and Science. Under the mentorship of our expert faculty, he cleared JEE Advanced with a remarkable rank.",
        initials: "AS",
        color: "bg-blue-100 text-blue-600",
        isActive: true,
        displayOrder: 1,
        schoolIds: ["mp-public", "mp-kids-school"]
    },
    {
        name: "Isha Verma",
        batch: "2022",
        category: "Medical",
        headline: "Cleared NEET with 680 Marks",
        summary: "Isha's dedication to medicine led her to secure a seat in one of India's top medical colleges.",
        story: "Isha's passion for Biology was evident since middle school. She consistently topped her classes and worked tirelessly to achieve her dream of becoming a doctor.",
        initials: "IV",
        color: "bg-red-100 text-red-600",
        isActive: true,
        displayOrder: 2,
        schoolIds: ["mp-public", "mp-kids-school"]
    },
    {
        name: "Rohan Gupta",
        batch: "2024",
        category: "Civil Services",
        headline: "Selected for State Civil Services",
        summary: "An aspiring leader, Rohan has always shown a keen interest in public service and social reform.",
        story: "Rohan was the head boy of the school and was always active in debates and social work. His selection in the civil services is a proud moment for all of us.",
        initials: "RG",
        color: "bg-emerald-100 text-emerald-600",
        isActive: true,
        displayOrder: 3,
        schoolIds: ["mp-public", "mp-kids-school"]
    },
    {
        name: "Sanya Malhotra",
        batch: "2023",
        category: "Sports",
        headline: "National Gold Medalist in Athletics",
        summary: "Sanya's speed and agility have brought numerous laurels to the school at various national levels.",
        story: "From early morning training sessions to winning on the track, Sanya's discipline and perseverance have been inspirational for her peers.",
        initials: "SM",
        color: "bg-orange-100 text-orange-600",
        isActive: true,
        displayOrder: 4,
        schoolIds: ["mp-public", "mp-kids-school"]
    }
];

async function seed() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI as string);
        console.log("Connected successfully");

        // Clear existing stories (optional, but since it's empty we'll just insert)
        // await SuccessStory.deleteMany({});

        console.log("Seeding Success Stories...");
        for (const story of stories) {
            await SuccessStory.findOneAndUpdate(
                { name: story.name, headline: story.headline },
                { $set: story },
                { upsert: true, new: true }
            );
        }

        console.log("Seed completed successfully");
        process.exit(0);
    } catch (error) {
        console.error("Seed error:", error);
        process.exit(1);
    }
}

seed();
