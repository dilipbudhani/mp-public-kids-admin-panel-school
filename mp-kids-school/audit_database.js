const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://mppublic:mppublic_school@mppublic.qo0bnof.mongodb.net/?appName=mppublic";

async function audit() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        // Define schemas briefly
        const GallerySchema = new mongoose.Schema({
            title: String,
            schoolIds: [String]
        }, { collection: 'Gallery' });

        const HeroSlideSchema = new mongoose.Schema({
            title: String,
            schoolIds: [String],
            isActive: Boolean
        }, { collection: 'HeroSlide' });

        const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);
        const HeroSlide = mongoose.models.HeroSlide || mongoose.model('HeroSlide', HeroSlideSchema);

        console.log("\n--- AUDIT: HeroSlide ---");
        const allSlides = await HeroSlide.find({});
        console.log(`Total Slides: ${allSlides.length}`);

        const nullSchoolIdSlides = allSlides.filter(s => !s.schoolIds || s.schoolIds.length === 0 || s.schoolIds.includes(null));
        console.log(`Slides with missing/null schoolIds: ${nullSchoolIdSlides.length}`);
        if (nullSchoolIdSlides.length > 0) {
            console.log("Example null slide:", JSON.stringify(nullSchoolIdSlides[0], null, 2));
        }

        const inactiveSlides = allSlides.filter(s => s.isActive === false);
        console.log(`Inactive Slides: ${inactiveSlides.length}`);

        const mpKidsSlides = await HeroSlide.find({ schoolIds: 'mp-kids-school' });
        console.log(`Slides for mp-kids-school: ${mpKidsSlides.length}`);

        const mpPublicSlides = await HeroSlide.find({ schoolIds: 'mp-public' });
        console.log(`Slides for mp-public: ${mpPublicSlides.length}`);

        console.log("\n--- AUDIT: Gallery ---");
        const allGallery = await Gallery.find({});
        console.log(`Total Gallery Items: ${allGallery.length}`);

        const schoolSpecificGallery = {
            'mp-kids-school': (await Gallery.find({ schoolIds: 'mp-kids-school' })).length,
            'mp-public': (await Gallery.find({ schoolIds: 'mp-public' })).length,
        };
        console.log("Gallery counts by schoolId filter:", schoolSpecificGallery);

        const nullGallery = allGallery.filter(g => !g.schoolIds || g.schoolIds.length === 0 || g.schoolIds.includes(null));
        console.log(`Gallery items with missing/null schoolIds: ${nullGallery.length}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

audit();
