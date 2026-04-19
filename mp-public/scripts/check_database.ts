
import { dbConnect } from "../src/lib/mongodb";
import mongoose from "mongoose";

async function checkData() {
    await dbConnect();
    const db = mongoose.connection.db;
    if (!db) {
        console.error("Database not connected");
        process.exit(1);
    }
    const collections = await db.listCollections().toArray();
    for (const col of collections) {
        const name = col.name;
        const stats = await db.collection(name).aggregate([
            { $group: { _id: "$schoolId", count: { $sum: 1 } } }
        ]).toArray();
        if (stats.length > 0) {
            console.log(`Collection: ${name}`);
            stats.forEach(s => console.log(`  SchoolID: ${s._id} -> Count: ${s.count}`));
        }
    }
    process.exit(0);
}

checkData();
