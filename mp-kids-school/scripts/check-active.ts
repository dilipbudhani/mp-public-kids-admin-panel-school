import mongoose from 'mongoose';
import dotenv from 'dotenv';
import HeroSlide from '../src/models/HeroSlide';
import Program from '../src/models/Program';
import Facility from '../src/models/Facility';

dotenv.config({ path: '.env' });

async function check() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("No MONGODB_URI");
        process.exit(1);
    }
    await mongoose.connect(uri);

    console.log("HeroSlides:");
    const slides = await HeroSlide.find({}).select({ title: 1, schoolIds: 1, isActive: 1 }).lean();
    console.log(JSON.stringify(slides, null, 2));

    console.log("\nPrograms:");
    const programs = await Program.find({}).select({ title: 1, schoolIds: 1, isActive: 1 }).lean();
    console.log(JSON.stringify(programs, null, 2));

    console.log("\nFacilities:");
    const facilities = await Facility.find({}).select({ title: 1, schoolIds: 1, isActive: 1 }).lean();
    console.log(JSON.stringify(facilities, null, 2));

    await mongoose.disconnect();
    process.exit(0);
}

check();
