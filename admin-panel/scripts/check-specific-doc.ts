import mongoose from "mongoose";
import dotenv from "dotenv";
import StaticPage from "../src/models/StaticPage";

dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;

async function check() {
    try {
        await mongoose.connect(MONGODB_URI as string);
        const page = await StaticPage.findOne({ _id: '69eb70e0741b7ad76f8aae86' }).lean();
        console.log(JSON.stringify(page, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

check();
