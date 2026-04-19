import TestimonialsClient from "./TestimonialsClient";
import { dbConnect } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import StaticPage from "@/models/StaticPage";

async function getTestimonials() {
    await dbConnect();
    const testimonials = await Testimonial.find({ isActive: true, schoolIds: process.env.SCHOOL_ID }).sort({ displayOrder: 1, createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(testimonials));
}

async function getPageData() {
    await dbConnect();
    const pageData = await StaticPage.findOne({ slug: "testimonials", schoolIds: process.env.SCHOOL_ID }).lean();
    const testimonials = await Testimonial.find({ schoolIds: process.env.SCHOOL_ID }).sort({ createdAt: -1 }).lean();
    return pageData ? JSON.parse(JSON.stringify(pageData)) : null;
}

export default async function TestimonialsPage() {
    const [testimonials, pageData] = await Promise.all([
        getTestimonials(),
        getPageData()
    ]);
    return <TestimonialsClient initialTestimonials={testimonials} pageData={pageData} />;
}
