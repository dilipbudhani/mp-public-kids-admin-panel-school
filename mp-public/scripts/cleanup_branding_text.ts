
import { dbConnect } from "../src/lib/mongodb";
import mongoose from "mongoose";

async function cleanupText() {
    await dbConnect();
    const db = mongoose.connection.db;
    if (!db) return process.exit(1);

    const schools = [
        { id: "mp-public", from: "MP Kids School", to: "MP Public School" },
        { id: "mp-kids-school", from: "MP Public School", to: "MP Kids School" }
    ];

    const collections = ['sitesettings', 'staticpages', 'heroslides', 'testimonials', 'news', 'schoolevents', 'circulars', 'programs', 'facilities'];

    for (const school of schools) {
        console.log(`Cleaning up branding text for schoolId: ${school.id}`);
        for (const name of collections) {
            const cursor = db.collection(name).find({ schoolId: school.id });
            while (await cursor.hasNext()) {
                const doc = await cursor.next();
                if (!doc) continue;

                let updated = false;
                const newDoc = { ...doc };

                const replaceString = (obj: any) => {
                    for (const key in obj) {
                        if (typeof obj[key] === 'string') {
                            if (obj[key].includes(school.from)) {
                                obj[key] = obj[key].replace(new RegExp(school.from, "g"), school.to);
                                updated = true;
                            }
                        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                            replaceString(obj[key]);
                        }
                    }
                };

                replaceString(newDoc);

                if (updated) {
                    console.log(`  Updating ${name} - ${doc._id}`);
                    await db.collection(name).replaceOne({ _id: doc._id }, newDoc);
                }
            }
        }
    }

    process.exit(0);
}

cleanupText();
