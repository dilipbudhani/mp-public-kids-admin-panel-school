const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://mppublic:mppublic_school@mppublic.qo0bnof.mongodb.net/?appName=mppublic";

async function deepAudit() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        const db = mongoose.connection.db;

        const collectionNames = ['heroslides', 'HeroSlide', 'Gallery', 'galleries'];

        for (const name of collectionNames) {
            const count = await db.collection(name).countDocuments();
            console.log(`\nCollection: ${name} - Count: ${count}`);
            if (count > 0) {
                const sample = await db.collection(name).find({}).limit(1).toArray();
                console.log(`Sample item:`, JSON.stringify(sample[0], null, 2));

                const nullSchoolIdCount = await db.collection(name).countDocuments({
                    $or: [
                        { schoolIds: { $exists: false } },
                        { schoolIds: null },
                        { schoolIds: { $size: 0 } },
                        { schoolIds: { $in: [null] } }
                    ]
                });
                console.log(`Items with missing/null schoolIds: ${nullSchoolIdCount}`);
            }
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

deepAudit();
