
import { dbConnect } from "../src/lib/mongodb";
import mongoose from "mongoose";

async function fixKidsSchool() {
    await dbConnect();
    const db = mongoose.connection.db;
    if (!db) return process.exit(1);

    const kidsSchoolId = "mp-kids-school";

    // 1. Fix SiteSettings for kids school
    console.log("Fixing SiteSettings for mp-kids-school...");
    await db.collection('sitesettings').updateOne(
        { schoolId: kidsSchoolId },
        {
            $set: {
                contactEmail: "info@mpkidsschool.org",
                facebookUrl: "https://facebook.com/mpkidsschool",
                instagramUrl: "https://instagram.com/mpkidsschool",
                twitterUrl: "https://twitter.com/mpkidsschool",
                youtubeUrl: "https://youtube.com/mpkidsschool"
            }
        }
    );

    // 2. Create HeroSlides for kids school if none exist
    const existingSlides = await db.collection('heroslides').find({ schoolId: kidsSchoolId }).toArray();
    if (existingSlides.length === 0) {
        console.log("Creating HeroSlides for mp-kids-school...");
        await db.collection('heroslides').insertMany([
            {
                schoolIds: [kidsSchoolId],
                schoolId: kidsSchoolId,
                title: "Where Small Steps Lead to",
                highlight: "Big Dreams",
                description: "A nurturing environment for your little ones to explore, learn, and grow. Specialized early childhood education with a focus on holistic development.",
                badge: "Admissions Open 2026-27",
                cta1Text: "Enroll Your Child",
                cta1Href: "/admissions",
                cta2Text: "Our Programs",
                cta2Href: "/programs",
                imageUrl: "/images/hero.png",
                statValue: "15+",
                statLabel: "Years of Excellence",
                displayOrder: 0,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                schoolIds: [kidsSchoolId],
                schoolId: kidsSchoolId,
                title: "Learning Through",
                highlight: "Play & Discovery",
                description: "Innovative curriculum designed to trigger curiosity and foster a love for learning in early years.",
                badge: "Join Our Family",
                cta1Text: "Find Out More",
                cta1Href: "/about",
                cta2Text: "Campus Facilities",
                cta2Href: "/facilities",
                imageUrl: "/images/hero-2.png",
                statValue: "100%",
                statLabel: "Child Satisfaction",
                displayOrder: 1,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    }

    process.exit(0);
}

fixKidsSchool();
