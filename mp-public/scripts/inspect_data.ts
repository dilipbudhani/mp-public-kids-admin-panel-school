
import { dbConnect } from "../src/lib/mongodb";
import mongoose from "mongoose";

async function inspectData() {
    await dbConnect();
    const db = mongoose.connection.db;
    if (!db) return process.exit(1);

    const schoolId = "mp-public";

    console.log("Inspecting HeroSlide:");
    const hero = await db.collection('heroslides').findOne({ schoolId });
    console.log(JSON.stringify(hero, null, 2));

    console.log("\nInspecting Stat:");
    const stat = await db.collection('stats').findOne({ schoolId });
    console.log(JSON.stringify(stat, null, 2));

    process.exit(0);
}

inspectData();
