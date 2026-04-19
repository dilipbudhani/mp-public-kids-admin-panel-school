
import { dbConnect } from "../src/lib/mongodb";
import mongoose from "mongoose";

async function fixData() {
    await dbConnect();
    const db = mongoose.connection.db;
    if (!db) return process.exit(1);

    const collections = await db.listCollections().toArray();
    for (const col of collections) {
        const name = col.name;
        // Update all docs where schoolId is set but schoolIds does not contain it
        // Or just set schoolIds = [schoolId] for all docs that have schoolId
        console.log(`Fixing collection: ${name}`);

        // For each document, if schoolId exists, make sure schoolIds is [schoolId]
        const cursor = db.collection(name).find({ schoolId: { $exists: true, $ne: null } });
        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            if (doc) {
                await db.collection(name).updateOne(
                    { _id: doc._id },
                    { $set: { schoolIds: [doc.schoolId] } }
                );
            }
        }
    }

    // Special fix for SiteSettings ID if needed, but wait, 
    // if page.tsx uses findOne({ _id: 'global' }), we need one doc with that ID.
    // But if it's shared, it's tricky.
    // Let's see if we can just change the query in page.tsx later.

    process.exit(0);
}

fixData();
