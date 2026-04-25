import mongoose from "mongoose";
import dotenv from "dotenv";
import StaticPage from "../src/models/StaticPage";

dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;

async function cleanup() {
    try {
        await mongoose.connect(MONGODB_URI as string);

        // Find all "Welcome to the About Our School page" documents for mp-kids-school
        const genericPages = await StaticPage.find({
            slug: 'about-overview',
            schoolIds: 'mp-kids-school',
            'sections.content': /Welcome to the About Our School page/
        });

        console.log(`Found ${genericPages.length} generic pages for mp-kids-school.`);
        for (const pg of genericPages) {
            console.log(`Deleting generic page: ${pg._id}`);
            await StaticPage.deleteOne({ _id: pg._id });
        }

        console.log("Cleanup finished.");
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

cleanup();
