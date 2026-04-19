
import { dbConnect } from "../src/lib/mongodb";
import mongoose from "mongoose";

async function auditData() {
    await dbConnect();
    const db = mongoose.connection.db;
    if (!db) return process.exit(1);

    const schoolId = "mp-kids-school";
    const collections = ['heroslides', 'stats', 'programs', 'facilities', 'sitesettings', 'staticpages', 'testimonials', 'news'];

    for (const name of collections) {
        const count = await db.collection(name).countDocuments({ schoolId });
        const countIds = await db.collection(name).countDocuments({ schoolIds: schoolId });
        console.log(`${name}: { schoolId: ${count}, schoolIds: ${countIds} }`);
    }

    process.exit(0);
}

auditData();
