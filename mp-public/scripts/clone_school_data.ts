
import { dbConnect } from "../src/lib/mongodb";
import mongoose from "mongoose";

async function cloneData() {
    await dbConnect();
    const db = mongoose.connection.db;
    if (!db) return process.exit(1);

    const sourceSchoolId = "mp-public";
    const targetSchoolId = "mp-kids-school";

    const collectionsToClone = [
        'stats',
        'programs',
        'facilities',
        'staticpages',
        'testimonials',
        'news',
        'schoolevents',
        'circulars',
        'gallery'
    ];

    console.log(`Cloning data from ${sourceSchoolId} to ${targetSchoolId}...`);

    for (const name of collectionsToClone) {
        console.log(`Processing collection: ${name}`);

        // Check if target already has data to avoid over-cloning
        const targetCount = await db.collection(name).countDocuments({ schoolId: targetSchoolId });
        if (targetCount > 0 && name !== 'staticpages') {
            console.log(`  Skipping ${name} - already has ${targetCount} records.`);
            continue;
        }

        const sourceDocs = await db.collection(name).find({ schoolId: sourceSchoolId }).toArray();
        console.log(`  Found ${sourceDocs.length} source documents.`);

        if (sourceDocs.length === 0) continue;

        const newDocs = sourceDocs.map(doc => {
            const { _id, ...rest } = doc;
            return {
                ...rest,
                schoolId: targetSchoolId,
                schoolIds: [targetSchoolId],
                createdAt: new Date(),
                updatedAt: new Date()
            };
        });

        if (name === 'staticpages') {
            // For static pages, we only want to clone if they don't exist by slug
            for (const doc of newDocs as any[]) {
                const exists = await db.collection(name).findOne({ schoolId: targetSchoolId, slug: doc.slug });
                if (!exists) {
                    console.log(`  Cloning static page: ${doc.slug}`);
                    await db.collection(name).insertOne(doc);
                }
            }
        } else {
            console.log(`  Inserting ${newDocs.length} documents into ${name}`);
            await db.collection(name).insertMany(newDocs);
        }
    }

    console.log("Cloning complete!");
    process.exit(0);
}

cloneData();
