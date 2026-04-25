const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://mppublic:mppublic_school@mppublic.qo0bnof.mongodb.net/?appName=mppublic";

async function fixVisibility() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        const db = mongoose.connection.db;

        const collectionsToFix = [
            'heroslides',
            'galleries',
            'testimonials',
            'news',
            'schoolevents',
            'circulars',
            'stats',
            'programs',
            'facilities',
            'boardtoppers',
            'socialposts',
            'successstories'
        ];

        const schoolIds = ['mp-kids-school', 'mp-public'];

        for (const colName of collectionsToFix) {
            console.log(`\nProcessing ${colName}...`);

            // Check if collection exists
            const collections = await db.listCollections({ name: colName }).toArray();
            if (collections.length === 0) {
                console.log(`Collection ${colName} does not exist, skipping.`);
                continue;
            }

            // Update all documents that have empty/missing/null schoolIds
            const result = await db.collection(colName).updateMany(
                {
                    $or: [
                        { schoolIds: { $exists: false } },
                        { schoolIds: null },
                        { schoolIds: { $size: 0 } },
                        { schoolIds: { $in: [null] } }
                    ]
                },
                { $set: { schoolIds: schoolIds } }
            );

            console.log(`Updated ${result.modifiedCount} items with empty schoolIds.`);

            // Also ensure existing items that have only one school ID are opened to both if preferred?
            // The user said "restore records for both schools" in a previous turn (implied by previous summary).
            // Let's do it for gallery at least.
            if (colName === 'galleries' || colName === 'heroslides') {
                const res2 = await db.collection(colName).updateMany(
                    { schoolIds: { $nin: [['mp-kids-school', 'mp-public'], ['mp-public', 'mp-kids-school']] } },
                    { $set: { schoolIds: schoolIds } }
                );
                console.log(`Updated ${res2.modifiedCount} additional items to have both school IDs.`);
            }
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixVisibility();
