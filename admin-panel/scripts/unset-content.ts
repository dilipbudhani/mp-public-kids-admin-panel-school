import mongoose from "mongoose";
import dotenv from "dotenv";
import StaticPage from "../src/models/StaticPage";

dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;

async function unsetContent() {
    try {
        await mongoose.connect(MONGODB_URI as string);
        const result = await StaticPage.updateMany(
            { slug: 'about-overview' },
            { $unset: { content: 1 } }
        );
        console.log("Unset Content Result:", result);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

unsetContent();
