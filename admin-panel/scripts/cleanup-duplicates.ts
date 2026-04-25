import mongoose from "mongoose";
import dotenv from "dotenv";
import StaticPage from "../src/models/StaticPage";

dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;

async function cleanup() {
    try {
        await mongoose.connect(MONGODB_URI as string);

        const allPages = await StaticPage.find({}).lean();
        const seen = new Set();
        const duplicates = [];

        for (const page of allPages) {
            const key = `${page.slug}-${page.schoolIds?.sort().join(',')}`;
            if (seen.has(key)) {
                duplicates.push(page);
            } else {
                seen.add(key);
            }
        }

        console.log("Found clones:", JSON.stringify(duplicates, null, 2));

        if (duplicates.length > 0) {
            console.log(`Deleting ${duplicates.length} duplicate documents...`);
            for (const dup of duplicates) {
                // Delete the one with the generic "Welcome to..." content if possible
                // if (dup.sections?.[0]?.content?.includes("Welcome to the About Our School page")) {
                //    await StaticPage.deleteOne({ _id: dup._id });
                // }
                // Let's just delete by ID for now based on what I see.
                await StaticPage.deleteOne({ _id: dup._id });
            }
            console.log("Cleanup finished.");
        } else {
            console.log("No clones found.");
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

cleanup();
