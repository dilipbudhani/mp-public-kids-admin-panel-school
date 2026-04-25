import mongoose from "mongoose";
import dotenv from "dotenv";
import Circular from "../src/models/Circular";

dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Please define the MONGODB_URI environment variable");
    process.exit(1);
}

const sampleCirculars = [
    {
        schoolIds: ["mp-public"],
        title: "Annual Sports Day 2024",
        date: new Date(),
        category: "Event",
        description: "Join us for the annual sports day extravaganza on the main playground.",
        isActive: true
    },
    {
        schoolIds: ["mp-public"],
        title: "Revised Fee Structure",
        date: new Date(),
        category: "Circular",
        description: "Please find the revised fee schedule for the upcoming academic year.",
        isActive: true
    },
    {
        schoolIds: ["mp-public"],
        title: "Examination Guidelines",
        date: new Date(),
        category: "Exam",
        description: "Important instructions for students appearing in the mid-term examinations.",
        isActive: true
    }
];

async function seed() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI as string);
        console.log("Connected successfully");

        console.log("Seeding circulars for mp-public...");
        await Circular.insertMany(sampleCirculars);
        console.log("Seeding completed successfully");

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

seed();
