import mongoose from "mongoose";
import dotenv from "dotenv";
import StaticPage from "../src/models/StaticPage";

dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;

async function update() {
    try {
        await mongoose.connect(MONGODB_URI as string);
        const result = await StaticPage.findOneAndUpdate(
            { slug: 'about-overview', schoolIds: 'mp-kids-school' },
            {
                $set: {
                    "sections.0.content": "FIXED_BY_AGENT: This is the updated content for MP Kids About Overview."
                }
            },
            { new: true }
        );
        console.log("Update Result:", JSON.stringify(result, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

update();
