import mongoose from 'mongoose';

async function checkIds() {
    const MONGODB_URI = 'mongodb+srv://mppublic:mppublic_school@mppublic.qo0bnof.mongodb.net/?appName=mppublic';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    const collections = await mongoose.connection.db?.listCollections().toArray();
    if (!collections) {
        console.log('No database connection or collections found.');
        process.exit(1);
    }
    console.log('\nScanning collections for schoolId/schoolIds:');

    for (const col of collections) {
        const name = col.name;
        const db = mongoose.connection.db;
        if (!db) continue;

        const schoolIds = await db.collection(name).distinct('schoolId');
        const schoolIdsArr = await db.collection(name).distinct('schoolIds');

        if (schoolIds.length > 0 || schoolIdsArr.length > 0) {
            console.log(`- ${name}:`);
            if (schoolIds.length > 0) console.log(`  schoolId: ${JSON.stringify(schoolIds)}`);
            if (schoolIdsArr.length > 0) console.log(`  schoolIds: ${JSON.stringify(schoolIdsArr)}`);
        }
    }

    await mongoose.disconnect();
}

checkIds().catch(console.error);
