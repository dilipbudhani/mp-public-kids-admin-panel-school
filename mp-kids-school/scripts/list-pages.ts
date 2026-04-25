import mongoose from 'mongoose';
import dotenv from 'dotenv';
import StaticPage from '../src/models/StaticPage';

dotenv.config({ path: '.env' });

async function list() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("No MONGODB_URI");
        process.exit(1);
    }
    await mongoose.connect(uri);
    const pages = await StaticPage.find({}).select({ slug: 1, title: 1, schoolIds: 1, isActive: 1 }).lean();
    console.log(JSON.stringify(pages, null, 2));
    await mongoose.disconnect();
    process.exit(0);
}

list();
