const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI not found');
    process.exit(1);
}

async function checkSettings() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const SiteSettings = mongoose.connection.collection('sitesettings');
        const count = await SiteSettings.countDocuments();
        console.log('Total settings documents:', count);

        const allSettings = await SiteSettings.find({}).toArray();
        console.log('Settings IDs:', allSettings.map(s => s._id));

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkSettings();
