import mongoose from "mongoose";
import dotenv from "dotenv";
import SchoolEvent from "../src/models/SchoolEvent";

dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Please define the MONGODB_URI environment variable");
    process.exit(1);
}

async function fix() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI as string);
        console.log("Connected successfully");

        console.log("Checking events...");
        const count = await SchoolEvent.countDocuments({});
        console.log(`Total events: ${count}`);

        const publicEvents = await SchoolEvent.countDocuments({ schoolIds: "mp-public" });
        console.log(`MP Public events: ${publicEvents}`);

        const kidsEvents = await SchoolEvent.countDocuments({ schoolIds: "mp-kids-school" });
        console.log(`MP Kids events: ${kidsEvents}`);

        const sample = await SchoolEvent.findOne({});
        if (sample) {
            console.log("Sample event:", JSON.stringify(sample, null, 2));
        }

        console.log("Updating all events to isActive: true...");
        const result = await SchoolEvent.updateMany(
            {},
            { $set: { isActive: true } }
        );

        console.log(`Updated ${result.modifiedCount} events.`);

        console.log("Fix completed successfully");
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

fix();
