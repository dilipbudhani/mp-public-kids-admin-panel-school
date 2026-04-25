
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://mppublic:mppublic_school@mppublic.qo0bnof.mongodb.net/?appName=mppublic";

async function checkCollections() {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.useDb('test');
    const collections = await db.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    // Check if there is both 'gallery' and 'galleries'
    for (const collName of ['gallery', 'galleries']) {
        const coll = db.collection(collName);
        const count = await coll.countDocuments();
        console.log(`Collection '${collName}' count: ${count}`);
    }

    await mongoose.disconnect();
}

checkCollections().catch(console.error);
