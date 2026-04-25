const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function check() {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    for (const col of collections) {
        if (col.name.includes('staticpages')) {
            const indexes = await db.collection(col.name).indexes();
            console.log(`Indexes for ${col.name}:`, JSON.stringify(indexes, null, 2));
        }
    }
    await mongoose.disconnect();
}

check();
