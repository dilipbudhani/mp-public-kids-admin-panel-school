import mongoose from "mongoose";
import dotenv from "dotenv";
import StaticPage from "../src/models/StaticPage";

dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;

async function check() {
    try {
        await mongoose.connect(MONGODB_URI as string);
        const underscoreDoc = await StaticPage.findOne({ slug: 'about_overview' }).lean();
        console.log("Underscore Doc:", JSON.stringify(underscoreDoc, null, 2));

        const hyphenDoc = await StaticPage.findOne({ slug: 'about-overview', schoolIds: 'mp-kids-school' }).lean();
        console.log("Hyphen Doc (Kids):", JSON.stringify(hyphenDoc, null, 2));

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

check();
