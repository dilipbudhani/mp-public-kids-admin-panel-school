import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is required in .env');
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    });

// Schema definition (simplified for seeding)
const staticPageSchema = new mongoose.Schema({
    schoolIds: [String],
    title: String,
    description: String,
    subtitle: String,
    slug: String,
    content: mongoose.Schema.Types.Mixed,
    sections: [mongoose.Schema.Types.Mixed],
});

const StaticPage = mongoose.models.StaticPage || mongoose.model('StaticPage', staticPageSchema);

const applyPageData = {
    schoolIds: ['mp-kids-school'],
    title: "Student Registration",
    description: "Complete the form below to initiate the admission process for the academic session 2026-27.",
    subtitle: "Apply Online",
    slug: "admissions-apply",
    sections: [
        {
            id: "available_classes",
            type: "classes",
            title: "Available Classes",
            content: "Nursery, KG, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12"
        }
    ]
};

async function seed() {
    try {
        console.log('Seeding Admissions Apply Page...');

        const existingPage = await StaticPage.findOne({ slug: 'admissions-apply', schoolIds: 'mp-kids-school' });

        if (existingPage) {
            console.log('Page already exists. Updating...');
            existingPage.title = applyPageData.title;
            existingPage.description = applyPageData.description;
            existingPage.subtitle = applyPageData.subtitle;
            existingPage.sections = applyPageData.sections;
            await existingPage.save();
        } else {
            console.log('Creating new page...');
            await StaticPage.create(applyPageData);
        }

        console.log('Successfully seeded Admissions Apply Page.');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        mongoose.disconnect();
    }
}

seed();
