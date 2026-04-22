import mongoose from 'mongoose';
import HeroSlide from './src/models/HeroSlide';
import Testimonial from './src/models/Testimonial';
import News from './src/models/News';
import Stat from './src/models/Stat';
import Program from './src/models/Program';
import Facility from './src/models/Facility';
import Gallery from './src/models/Gallery';
import SiteSettings from './src/models/SiteSettings';

async function checkData() {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        throw new Error('Please define the MONGODB_URI environment variable');
    }

    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    const schools = ['mp-public-school', 'mp-kids-school'];
    const models = [
        { name: 'HeroSlide', model: HeroSlide },
        { name: 'Testimonial', model: Testimonial },
        { name: 'News', model: News },
        { name: 'Stat', model: Stat },
        { name: 'Program', model: Program },
        { name: 'Facility', model: Facility },
        { name: 'Gallery', model: Gallery },
        { name: 'SiteSettings', model: SiteSettings }
    ];

    for (const schoolId of schools) {
        console.log(`\n--- Data for School: ${schoolId} ---`);
        for (const { name, model } of models) {
            let query: any = {};
            if (model.schema.paths.schoolId) {
                query = { schoolId };
            } else if (model.schema.paths.schoolIds) {
                query = { schoolIds: schoolId };
            }

            const count = await model.countDocuments(query);
            console.log(`${name}: ${count}`);
        }
    }

    await mongoose.disconnect();
}

checkData().catch(console.error);
