
import { dbConnect } from "./src/lib/mongodb";
import mongoose from "mongoose";

async function testConnection() {
    try {
        console.log("Connecting to MongoDB...");
        await dbConnect();
        console.log("Connected successfully!");
        const collections = await mongoose.connection.db?.listCollections().toArray();
        console.log("Collections:", collections?.map(c => c.name));
        process.exit(0);
    } catch (error) {
        console.error("Connection failed:", error);
        process.exit(1);
    }
}

testConnection();
