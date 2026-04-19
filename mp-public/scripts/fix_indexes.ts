
import { dbConnect } from "../src/lib/mongodb";
import mongoose from "mongoose";

async function fixIndexes() {
    await dbConnect();
    const db = mongoose.connection.db;
    if (!db) return process.exit(1);

    const collections = ['staticpages', 'news', 'programs', 'facilities'];

    for (const name of collections) {
        console.log(`Checking indexes for ${name}...`);
        const indexes = await db.collection(name).indexes();

        // For staticpages and news, we know slug is unique
        if (name === 'staticpages' || name === 'news') {
            const slugIndex = indexes.find(idx => idx.name === 'slug_1' || idx.key.slug === 1);
            if (slugIndex && slugIndex.unique) {
                console.log(`  Dropping unique index on slug for ${name}...`);
                await db.collection(name).dropIndex(slugIndex.name!);
                console.log(`  Creating compound index on { slug: 1, schoolId: 1 } for ${name}...`);
                await db.collection(name).createIndex({ slug: 1, schoolId: 1 }, { unique: true });
            }
        }
    }

    process.exit(0);
}

fixIndexes();
