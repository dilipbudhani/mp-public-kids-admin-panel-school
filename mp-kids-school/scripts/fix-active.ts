import mongoose from 'mongoose';
import dotenv from 'dotenv';
import StaticPage from '../src/models/StaticPage';

dotenv.config({ path: '.env' });

async function fix() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("No MONGODB_URI");
        process.exit(1);
    }
    await mongoose.connect(uri);

    console.log("Setting isActive: true for all StaticPages...");
    const result = await StaticPage.updateMany({}, { $set: { isActive: true } });
    console.log(`Updated ${result.modifiedCount} documents.`);

    await mongoose.disconnect();
    process.exit(0);
}

fix();
