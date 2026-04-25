const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function fix() {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    try {
        await db.collection('staticpages').dropIndex('slug_1_schoolId_1');
        console.log('Successfully dropped legacy index: slug_1_schoolId_1');
    } catch (e) {
        console.log('Index might already be gone or error:', e.message);
    }
    await mongoose.disconnect();
}

fix();
