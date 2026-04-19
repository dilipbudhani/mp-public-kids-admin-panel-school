
import { dbConnect } from "../src/lib/mongodb";
import mongoose from "mongoose";

async function cleanupTestimonials() {
    await dbConnect();
    const db = mongoose.connection.db;
    if (!db) return process.exit(1);

    const schoolId = "mp-public";
    console.log(`Cleaning up MPKS branding in testimonials for ${schoolId}...`);

    const cursor = db.collection('testimonials').find({ schoolId });
    while (await cursor.hasNext()) {
        const doc = await cursor.next();
        if (!doc) continue;

        if (doc.content && doc.content.includes("MPKS")) {
            const newContent = doc.content.replace(/MPKS/g, "MP Public School");
            console.log(`  Updating testimonial ${doc._id}`);
            await db.collection('testimonials').updateOne(
                { _id: doc._id },
                { $set: { content: newContent } }
            );
        }
    }

    process.exit(0);
}

cleanupTestimonials();
