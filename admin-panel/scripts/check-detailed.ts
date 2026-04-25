import mongoose from "mongoose";
import dotenv from "dotenv";
import StaticPage from "../src/models/StaticPage";

dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;

async function check() {
    try {
        await mongoose.connect(MONGODB_URI as string);
        const pages = await StaticPage.find({ slug: 'about-overview' }).lean();
        pages.forEach(p => {
            console.log(`ID: ${p._id}, School: ${p.schoolIds}, Content Preview: ${p.sections?.[0]?.content?.substring(0, 50)}...`);
        });
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

check();
