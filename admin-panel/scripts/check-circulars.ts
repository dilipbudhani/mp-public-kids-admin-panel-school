import mongoose from "mongoose";
import dotenv from "dotenv";
import Circular from "../src/models/Circular";

dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Please define the MONGODB_URI environment variable");
    process.exit(1);
}

async function check() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI as string);
        console.log("Connected successfully");

        const count = await Circular.countDocuments({});
        console.log(`Total circulars: ${count}`);

        const publicCirculars = await Circular.countDocuments({ schoolIds: "mp-public" });
        console.log(`MP Public circulars: ${publicCirculars}`);

        const kidsCirculars = await Circular.countDocuments({ schoolIds: "mp-kids-school" });
        console.log(`MP Kids circulars: ${kidsCirculars}`);

        const sample = await Circular.findOne({ schoolIds: "mp-kids-school" });
        if (sample) {
            console.log("Sample Circular (Kids):", JSON.stringify(sample, null, 2));
        }

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

check();
