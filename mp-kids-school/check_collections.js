const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://mppublic:mppublic_school@mppublic.qo0bnof.mongodb.net/?appName=mppublic";

async function listCollections() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log("Collections in database:");
        collections.forEach(c => console.log(` - ${c.name}`));

        // Sample a few items from a likely collection
        const likelyCollection = collections.find(c => c.name.toLowerCase().includes('gallery'))?.name;
        if (likelyCollection) {
            const items = await db.collection(likelyCollection).find({}).limit(1).toArray();
            console.log(`\nSample item from ${likelyCollection}:`, JSON.stringify(items[0], null, 2));
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listCollections();
