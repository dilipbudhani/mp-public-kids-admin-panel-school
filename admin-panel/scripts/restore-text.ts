import mongoose from "mongoose";
import dotenv from "dotenv";
import StaticPage from "../src/models/StaticPage";

dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;

async function restore() {
    try {
        await mongoose.connect(MONGODB_URI as string);
        const text = `MP Kids School is committed to providing quality education in a safe, nurturing, and engaging environment. Our aim is to build a strong foundation for every child by focusing on both academic excellence and overall personality development.\n\nWe believe that every child is unique and has the potential to succeed. With experienced teachers, modern teaching methods, and activity-based learning, we ensure that students not only learn but also enjoy the process of learning.`;

        await StaticPage.findOneAndUpdate(
            { slug: 'about-overview', schoolIds: 'mp-kids-school' },
            {
                $set: {
                    "sections.0.content": text
                }
            }
        );
        console.log("Restored successfully.");
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

restore();
