const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

const SiteSettingsSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.Mixed, required: true },
    schoolName: { type: String },
}, { collection: 'sitesettings' });

const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);

async function testFetch() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected');

        const schoolId = 'mp-kids-school';
        const settings = await SiteSettings.findById(schoolId);
        console.log('Settings found:', settings);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

testFetch();
