
import { dbConnect } from "../src/lib/mongodb";
import mongoose from "mongoose";

async function checkData() {
    await dbConnect();
    const db = mongoose.connection.db;
    if (!db) {
        console.error("Database not connected");
        process.exit(1);
    }

    const schoolId = process.env.SCHOOL_ID || "mp-public";

    console.log(`Checking data for schoolId: ${schoolId}`);

    const collections = [
        { name: 'heroslides', query: { schoolId, isActive: true } },
        { name: 'testimonials', query: { schoolId, isActive: true } },
        { name: 'news', query: { schoolId, isPublished: true } },
        { name: 'schoolevents', query: { schoolId, isActive: true } },
        { name: 'circulars', query: { schoolId, isActive: true } },
        { name: 'stats', query: { schoolId } },
        { name: 'staticpages', query: { schoolId, slug: 'about-us' } },
        { name: 'programs', query: { schoolId, isActive: true } },
        { name: 'facilities', query: { schoolId, isActive: true } },
        { name: 'sitesettings', query: { schoolId, _id: 'global' } },
        { name: 'galleries', query: { schoolId, type: 'image' } }
    ];

    for (const col of collections) {
        const count = await db.collection(col.name).countDocuments(col.query as any);
        console.log(`Collection: ${col.name} -> Query: ${JSON.stringify(col.query)} -> Count: ${count}`);
        if (count > 0 && col.name === 'staticpages') {
            const doc = await db.collection(col.name).findOne(col.query as any);
            console.log(`  Found StaticPage: ${doc?.title}`);
        }
    }
    process.exit(0);
}

checkData();
