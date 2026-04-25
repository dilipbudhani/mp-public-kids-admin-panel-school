
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://mppublic:mppublic_school@mppublic.qo0bnof.mongodb.net/?appName=mppublic";

async function checkHeroSlides() {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.useDb('test');

    const heroCollection = db.collection('heroslides');
    const slides = await heroCollection.find({}).toArray();

    console.log(`Total Hero Slides: ${slides.length}`);
    slides.forEach(slide => {
        console.log(`Title: ${slide.title}, SchoolIds: ${JSON.stringify(slide.schoolIds)}, IsActive: ${slide.isActive}`);
    });

    await mongoose.disconnect();
}

checkHeroSlides().catch(console.error);
