import TestimonialsClient from "./TestimonialsClient";
import { dbConnect } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import StaticPage from "@/models/StaticPage";

async function getTestimonials() {
    await dbConnect();
    const testimonials = await Testimonial.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(testimonials));
}

async function getPageData() {
    await dbConnect();
    const page = await StaticPage.findOne({ slug: "testimonials" }).lean();
    return page ? JSON.parse(JSON.stringify(page)) : null;
}

export default async function TestimonialsPage() {
    const [testimonials, pageData] = await Promise.all([
        getTestimonials(),
        getPageData()
    ]);
    return <TestimonialsClient initialTestimonials={testimonials} pageData={pageData} />;
}
