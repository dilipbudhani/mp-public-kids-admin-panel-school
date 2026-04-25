import mongoose from "mongoose";
import dotenv from "dotenv";
import StaticPage from "../src/models/StaticPage";

dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;

const PROCESS_STEPS = [
    {
        n: '01',
        title: 'Apply on State RTE Portal',
        desc: 'Visit the official Madhya Pradesh RTE portal and complete the online application form. Select MP Kids School as your preferred school.',
        link: { label: 'Visit mp.gov.in/rte', href: 'https://rteportal.mp.gov.in' },
    },
    {
        n: '02',
        title: 'Lottery-Based Seat Allotment',
        desc: 'Seats are allotted through a transparent computerised lottery conducted by the state government. Results are published on the portal.',
        link: null,
    },
    {
        n: '03',
        title: 'Report to School with Documents',
        desc: 'If your child is allotted a seat, visit the school within 7 days of allotment with all original documents for verification.',
        link: null,
    },
    {
        n: '04',
        title: 'Admission Confirmed',
        desc: 'After document verification, admission is confirmed at zero cost. No fees of any kind are charged from RTE students.',
        link: null,
    },
];

const DATES = [
    { label: 'Application Start', date: '01 May 2026', status: 'upcoming' },
    { label: 'Application End', date: '31 May 2026', status: 'upcoming' },
    { label: 'Lottery Date', date: '15 June 2026', status: 'upcoming' },
    { label: 'Admission Deadline', date: '30 June 2026', status: 'upcoming' },
];

const FAQS = [
    {
        q: 'Is RTE admission completely free?',
        a: 'Yes. Under Section 12(1)(c) of the RTE Act, private unaided schools must admit children from EWS/disadvantaged groups free of charge. The school cannot charge any fee — tuition, development, or otherwise — from RTE students. The state government reimburses the school at a prescribed rate.',
    },
    {
        q: 'Can a private school refuse to admit an RTE-allotted student?',
        a: 'No. Once a seat is allotted through the official state lottery, the school is legally obligated to admit the child. Refusal is a punishable offence under the RTE Act. Parents may lodge a complaint with the District Education Officer (DEO) if a school refuses.',
    },
    {
        q: 'What if my child is not selected in the lottery?',
        a: 'RTE seats are limited to 25% of Class 1 intake. If your child is not selected in the first lottery, they may be placed on a waiting list. If seats remain after all waiting-list students are accommodated, a second lottery may be held. You can re-apply in the next academic session.',
    },
    {
        q: 'Are textbooks and uniforms provided to RTE students?',
        a: 'Yes. The state government provides free textbooks to RTE students. Schools are also required to provide uniforms as per the Madhya Pradesh government norms. These are supplied at the beginning of the session.',
    },
    {
        q: 'Can I apply to multiple schools under RTE?',
        a: 'Yes. The MP RTE portal allows you to list up to 3 schools in order of preference. Seats are allotted based on your preference list and distance from your residence to the school as per neighbourhood norms.',
    },
    {
        q: 'What happens to my child after Class 8 under RTE?',
        a: 'The RTE Act guarantees free and compulsory education from Class 1 to Class 8. After Class 8, the entitlement under RTE ends. Parents will need to make separate arrangements for Classes 9 onwards, though many state governments offer scholarship schemes for continuation.',
    },
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI as string);

        const existing = await StaticPage.findOne({ slug: 'admissions-rte', schoolIds: 'mp-kids-school' });

        const pageData = {
            title: "RTE Admissions 2026-27",
            subtitle: "Right to Education Act, 2009",
            description: "Apply for RTE (Right to Education) admissions at MP Kids School under Section 12(1)(c). 25% seats reserved for economically weaker sections and disadvantaged groups.",
            slug: "admissions-rte",
            schoolIds: ["mp-kids-school"],
            sections: [
                {
                    title: "What is the RTE Act?",
                    content: "The Right of Children to Free and Compulsory Education (RTE) Act, 2009 is a landmark legislation that makes free and compulsory education a fundamental right for all children between the ages of 6 and 14 years in India.",
                    order: 0,
                    type: "standard"
                },
                {
                    title: "Application Process",
                    key: "rte_process",
                    items: PROCESS_STEPS,
                    order: 1,
                    type: "featured"
                },
                {
                    title: "Important Dates",
                    key: "rte_dates",
                    items: DATES,
                    order: 2,
                    type: "grid"
                },
                {
                    title: "Frequently Asked Questions",
                    key: "rte_faqs",
                    items: FAQS,
                    order: 3,
                    type: "standard"
                },
                {
                    title: "Contact Phone",
                    key: "rte_contact_phone",
                    content: "+91 73140 01234",
                    order: 4,
                    type: "standard"
                },
                {
                    title: "Contact Email",
                    key: "rte_contact_email",
                    content: "rte@mppublicschool.edu.in",
                    order: 5,
                    type: "standard"
                }
            ],
            bannerImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop"
        };

        if (existing) {
            await StaticPage.updateOne({ _id: existing._id }, { $set: pageData });
            console.log("Updated existing RTE page.");
        } else {
            await StaticPage.create(pageData);
            console.log("Created new RTE page.");
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

seed();
