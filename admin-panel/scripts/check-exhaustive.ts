import mongoose from "mongoose";
import dotenv from "dotenv";
import StaticPage from "../src/models/StaticPage";

dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;

async function check() {
    try {
        await mongoose.connect(MONGODB_URI as string);
        const count = await StaticPage.countDocuments({ slug: 'about-overview' });
        console.log("Total Count for slug 'about-overview':", count);

        const all = await StaticPage.find({ slug: 'about-overview' }).lean();
        all.forEach(p => {
            console.log(`ID: ${p._id}, Schools: ${p.schoolIds}, Title: ${p.title}`);
            console.log(`Content: ${p.sections?.[0]?.content?.substring(0, 100)}...`);
            console.log("---");
        });
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

check();
