const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://mppublic:mppublic_school@mppublic.qo0bnof.mongodb.net/?appName=mppublic";

async function verify() {
    try {
        await mongoose.connect(MONGODB_URI);
        const db = mongoose.connection.db;

        const kidsHero = await db.collection('heroslides').countDocuments({ schoolIds: 'mp-kids-school' });
        const publicHero = await db.collection('heroslides').countDocuments({ schoolIds: 'mp-public' });

        const kidsGallery = await db.collection('galleries').countDocuments({ schoolIds: 'mp-kids-school' });
        const publicGallery = await db.collection('galleries').countDocuments({ schoolIds: 'mp-public' });

        console.log(`Hero Slides - Kids: ${kidsHero}, Public: ${publicHero}`);
        console.log(`Gallery Items - Kids: ${kidsGallery}, Public: ${publicGallery}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

verify();
