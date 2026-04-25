import mongoose from "mongoose";
import dotenv from "dotenv";
import StaticPage from "../src/models/StaticPage";

dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;

const missingSlugs = [
    "about", "academics", "academics-pre-primary", "academics-primary", "academics-middle", "academics-secondary", "academics-senior-secondary",
    "admissions-status", "facilities-classrooms", "facilities-science-labs", "facilities-computer-lab", "facilities-library", "facilities-sports", "facilities-transport",
    "contact", "transport", "life-at-school", "achievements", "faculty", "downloads", "virtual-tour", "alumni", "careers", "faqs", "feedback", "testimonials",
    "success-stories", "results", "privacy-policy", "terms", "disclaimer", "sitemap"
];

const slugToTitle: Record<string, string> = {
    "about": "About Us",
    "academics": "Academic Excellence",
    "academics-pre-primary": "Pre-Primary Education",
    "academics-primary": "Primary Education",
    "academics-middle": "Middle School",
    "academics-secondary": "Secondary Education",
    "academics-senior-secondary": "Senior Secondary Education",
    "admissions-status": "Admission Status",
    "facilities-classrooms": "Modern Classrooms",
    "facilities-science-labs": "State-of-the-Art Science Labs",
    "facilities-computer-lab": "Advanced Computer Lab",
    "facilities-library": "Knowledge Hub - Library",
    "facilities-sports": "Sports & Athletics",
    "facilities-transport": "Safe Transport Facilities",
    "contact": "Contact Us",
    "transport": "Transport Services",
    "life-at-school": "Life at School",
    "achievements": "Our Achievements",
    "faculty": "Our Expert Faculty",
    "downloads": "Important Downloads",
    "virtual-tour": "Virtual Campus Tour",
    "alumni": "Alumni Association",
    "careers": "Careers at School",
    "faqs": "Frequently Asked Questions",
    "feedback": "Your Feedback",
    "testimonials": "Student & Parent Testimonials",
    "success-stories": "Inspirational Success Stories",
    "results": "Academic Results",
    "privacy-policy": "Privacy Policy",
    "terms": "Terms & Conditions",
    "disclaimer": "Disclaimer",
    "sitemap": "Site Map"
};

const defaultImages: Record<string, string> = {
    "about": "https://images.unsplash.com/photo-1523050853064-85a92790642f?q=80&w=2070",
    "academics": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022",
    "facilities": "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070",
    "contact": "https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?q=80&w=2110",
    "default": "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071"
};

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI as string);
        console.log("Connected to MongoDB.");

        const schools = ["mp-public", "mp-kids-school"];

        for (const schoolId of schools) {
            console.log(`\n--- Seeding for ${schoolId} ---`);
            for (const slug of missingSlugs) {
                const existing = await StaticPage.findOne({ slug, schoolIds: schoolId });
                if (existing) {
                    console.log(`- Page already exists: ${slug}`);
                    continue;
                }

                const title = slugToTitle[slug] || "New Page";
                const category = slug.split("-")[0];
                const bannerImage = defaultImages[category] || defaultImages.default;

                await StaticPage.create({
                    schoolIds: [schoolId],
                    title: `${title} - ${schoolId === 'mp-public' ? 'MP Public' : 'MP Kids'}`,
                    slug,
                    bannerImage,
                    description: `Experience the best ${title.toLowerCase()} at our school.`,
                    sections: [
                        {
                            title: title,
                            content: `This is the ${title.toLowerCase()} page for ${schoolId === 'mp-public' ? 'MP Public School' : 'MP Kids School'}. We are currently updating this section with detailed information. Please check back soon!`,
                            order: 0
                        }
                    ]
                });
                console.log(`+ Created page: ${slug}`);
            }
        }

        console.log("\nSeeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seed();
