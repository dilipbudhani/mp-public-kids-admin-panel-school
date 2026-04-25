
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://mppublic:mppublic_school@mppublic.qo0bnof.mongodb.net/?appName=mppublic";

async function migrateData() {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.useDb('test');
    const galleryCollection = db.collection('galleries');

    // 1. Find items with schoolIds containing null
    // In MongoDB, searching for { schoolIds: null } matches if the array contains null OR if the field itself is null.
    // To be precise about the array containing null:
    const query = {
        $or: [
            { schoolIds: null },
            { schoolIds: { $exists: false } },
            { schoolIds: { $size: 0 } },
            { schoolIds: { $elemMatch: { $eq: null } } }
        ]
    };

    const count = await galleryCollection.countDocuments(query);
    console.log(`Found ${count} items needing fix.`);

    if (count > 0) {
        const result = await galleryCollection.updateMany(
            query,
            { $set: { schoolIds: ["mp-kids-school", "mp-public"] } }
        );
        console.log(`Updated ${result.modifiedCount} items.`);
    }

    await mongoose.disconnect();
}

migrateData().catch(console.error);
