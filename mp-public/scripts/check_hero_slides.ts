
import { dbConnect } from "../src/lib/mongodb";
import mongoose from "mongoose";

async function checkHeroSlides() {
    await dbConnect();
    const db = mongoose.connection.db;
    if (!db) return process.exit(1);

    console.log("HeroSlide records:");
    const slides = await db.collection('heroslides').find({}).toArray();
    console.log(JSON.stringify(slides, null, 2));

    console.log("\nSiteSettings records:");
    const settings = await db.collection('sitesettings').find({}).toArray();
    console.log(JSON.stringify(settings, null, 2));

    process.exit(0);
}

checkHeroSlides();
