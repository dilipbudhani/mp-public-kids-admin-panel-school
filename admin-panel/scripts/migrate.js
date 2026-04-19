const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://mppublic:mppublic_school@mppublic.qo0bnof.mongodb.net/?appName=mppublic";
const DEFAULT_SCHOOL_ID = 'mp-kids-school';

async function migrate() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected successfully.');

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        console.log(`Found ${collectionNames.length} collections.`);

        // Models that use schoolId (string)
        const singleSchoolModels = ['leads', 'admissions', 'students', 'notificationlogs'];

        // Models that use schoolIds (array)
        const multiSchoolModels = [
            'achievements', 'alumnis', 'circulars', 'disclosures',
            'facilities', 'faculties', 'feestructures', 'galleries',
            'heroslides', 'jobs', 'news', 'programs', 'schoolevents',
            'sitesettings', 'stats', 'staticpages', 'successstories',
            'testimonials'
        ];

        for (const name of collectionNames) {
            const lowerName = name.toLowerCase();

            if (singleSchoolModels.includes(lowerName)) {
                console.log(`Migrating single-school collection: ${name}`);
                const result = await db.collection(name).updateMany(
                    { $or: [{ schoolId: { $exists: false } }, { schoolId: null }] },
                    { $set: { schoolId: DEFAULT_SCHOOL_ID } }
                );
                console.log(`Updated ${result.modifiedCount} documents in ${name}`);
            } else if (multiSchoolModels.includes(lowerName)) {
                console.log(`Migrating multi-school collection: ${name}`);
                const result = await db.collection(name).updateMany(
                    { $or: [{ schoolIds: { $exists: false } }, { schoolIds: { $size: 0 } }, { schoolIds: null }] },
                    { $set: { schoolIds: [DEFAULT_SCHOOL_ID] } }
                );
                console.log(`Updated ${result.modifiedCount} documents in ${name}`);
            }
        }

        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

migrate();
