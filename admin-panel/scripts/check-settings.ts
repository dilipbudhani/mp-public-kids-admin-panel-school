const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const SiteSettings = require('../src/models/SiteSettings').default;

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const settings = await SiteSettings.findOne({ schoolIds: 'mp-kids-school' });
        console.log(JSON.stringify(settings, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
