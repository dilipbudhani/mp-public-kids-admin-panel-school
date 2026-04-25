const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from admin-panel directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env');
    process.exit(1);
}

const SCHOOLS = [
    { id: 'mp-public-school', name: 'MP Public School' },
    { id: 'mp-kids-school', name: 'MP Kids School' }
];

const PAGES = [
    { title: 'Home', slug: 'home' },
    { title: 'About Us', slug: 'about' },
    { title: 'About Overview', slug: 'about-overview' },
    { title: 'Vision & Mission', slug: 'about-vision' },
    { title: 'Leadership', slug: 'about-leadership' },
    { title: 'History', slug: 'about-history' },
    { title: 'Principal\'s Message', slug: 'about-principal' },
    { title: 'Academics Overview', slug: 'academics' },
    { title: 'Pre-Primary', slug: 'academics-pre-primary' },
    { title: 'Primary', slug: 'academics-primary' },
    { title: 'Middle', slug: 'academics-middle' },
    { title: 'Secondary', slug: 'academics-secondary' },
    { title: 'Senior Secondary', slug: 'academics-senior-secondary' },
    { title: 'Admissions Overview', slug: 'admissions' },
    { title: 'Apply Now', slug: 'admissions-apply' },
    { title: 'RTE Admissions', slug: 'admissions-rte' },
    { title: 'Admission Status', slug: 'admissions-status' },
    { title: 'Facilities Overview', slug: 'facilities' },
    { title: 'Classrooms', slug: 'facilities-classrooms' },
    { title: 'Science Labs', slug: 'facilities-science-labs' },
    { title: 'Computer Lab', slug: 'facilities-computer-lab' },
    { title: 'Library', slug: 'facilities-library' },
    { title: 'Sports', slug: 'facilities-sports' },
    { title: 'Transport Facilities', slug: 'facilities-transport' },
    { title: 'Contact Us', slug: 'contact' },
    { title: 'Notices', slug: 'notices' },
    { title: 'Transport (General)', slug: 'transport' },
    { title: 'Life at School', slug: 'life-at-school' },
    { title: 'Gallery', slug: 'gallery' },
    { title: 'News', slug: 'news' },
    { title: 'Achievements', slug: 'achievements' },
    { title: 'Fee Structure', slug: 'fee-structure' },
    { title: 'Faculty', slug: 'faculty' },
    { title: 'Co-Curricular', slug: 'co-curricular' },
    { title: 'Downloads', slug: 'downloads' },
    { title: 'Virtual Tour', slug: 'virtual-tour' },
    { title: 'Alumni', slug: 'alumni' },
    { title: 'Careers', slug: 'careers' },
    { title: 'FAQs', slug: 'faqs' },
    { title: 'Feedback', slug: 'feedback' },
    { title: 'Testimonials', slug: 'testimonials' },
    { title: 'Success Stories', slug: 'success-stories' },
    { title: 'Results', slug: 'results' },
    { title: 'Academic Calendar', slug: 'academic-calendar' },
    { title: 'Mandatory Disclosure', slug: 'cbse-disclosure' },
    { title: 'Privacy Policy', slug: 'privacy-policy' },
    { title: 'Terms & Conditions', slug: 'terms' },
    { title: 'Disclaimer', slug: 'disclaimer' },
    { title: 'Sitemap', slug: 'sitemap' },
];

const PageSchema = new mongoose.Schema({
    school: { type: String, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    sections: { type: Array, default: [] },
    isDraft: { type: Boolean, default: false },
    version: { type: Number, default: 1 }
}, { timestamps: true });

// Use "Page" as the model name to match the application's models/Page.ts
const Page = mongoose.models.Page || mongoose.model('Page', PageSchema);

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        for (const school of SCHOOLS) {
            console.log(`\nSeeding pages for ${school.name}...`);
            for (const pageInfo of PAGES) {
                // Check if page already exists with the correct model
                const existing = await Page.findOne({
                    slug: pageInfo.slug,
                    school: school.id
                });

                if (existing) {
                    console.log(`- Page already exists: ${pageInfo.slug}`);
                    // Ensure it's not a draft
                    if (existing.isDraft) {
                        existing.isDraft = false;
                        await existing.save();
                        console.log(`  (updated: set isDraft to false)`);
                    }
                    continue;
                }

                await Page.create({
                    title: `${pageInfo.title} (${school.name})`,
                    slug: pageInfo.slug,
                    school: school.id,
                    sections: [],
                    isDraft: false,
                    version: 1
                });
                console.log(`+ Created page: ${pageInfo.slug}`);
            }
        }

        console.log('\nSeeding completed successfully.');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
