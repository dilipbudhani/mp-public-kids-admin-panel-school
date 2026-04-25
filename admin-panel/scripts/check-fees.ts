import mongoose from "mongoose";
import dotenv from "dotenv";
import FeeStructure from "../src/models/FeeStructure";

dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;

async function check() {
    try {
        await mongoose.connect(MONGODB_URI as string);
        const count = await FeeStructure.countDocuments();
        console.log(`FeeStructure count: ${count}`);
        const data = await FeeStructure.find();
        console.log(JSON.stringify(data, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

check();
