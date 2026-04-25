import mongoose from "mongoose";
import dotenv from "dotenv";

const staticPageSchema = new mongoose.Schema({
    slug: String,
    schoolIds: [String],
    title: String,
    sections: Array
}, { collection: 'staticpages' });

const StaticPage = mongoose.models.StaticPage || mongoose.model("StaticPage", staticPageSchema);

dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;

const requiredSlugs = [
    "about", "about-overview", "about-vision", "about-leadership", "about-history", "about-principal",
    "academics", "academics-pre-primary", "academics-primary", "academics-middle", "academics-secondary", "academics-senior-secondary",
    "admissions", "admissions-apply", "admissions-rte", "admissions-status",
    "facilities", "facilities-classrooms", "facilities-science-labs", "facilities-computer-lab", "facilities-library", "facilities-sports", "facilities-transport",
    "contact", "notices", "transport", "life-at-school", "gallery", "news", "achievements", "fee-structure", "faculty", "co-curricular", "downloads", "virtual-tour", "alumni", "careers", "faqs", "feedback", "testimonials", "success-stories", "results", "academic-calendar", "cbse-disclosure", "privacy-policy", "terms", "disclaimer", "sitemap"
];

async function audit() {
    try {
        await mongoose.connect(MONGODB_URI as string);
        const allPages = await StaticPage.find({}).lean();

        console.log("--- DETAILED AUDIT RESULTS ---");
        const schools = ["mp-public", "mp-kids-school"];

        schools.forEach(school => {
            console.log(`\nSchool: ${school}`);
            const schoolPages = allPages.filter(p => p.schoolIds.includes(school));
            const existingSlugs = schoolPages.map(p => p.slug);

            const missing = requiredSlugs.filter(slug => !existingSlugs.includes(slug));
            const found = requiredSlugs.filter(slug => existingSlugs.includes(slug));

            console.log(`Found: ${found.length} / ${requiredSlugs.length}`);
            console.log(`Missing Slugs: ${missing.join(", ")}`);
        });

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

audit();
