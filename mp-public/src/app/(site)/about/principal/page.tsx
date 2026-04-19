import React from "react";
import Image from "next/image";
import { AboutPageLayout } from "@/components/about/AboutPageLayout";
import { Users, Quote, GraduationCap, Briefcase } from "lucide-react";
import * as motion from "framer-motion/client";
import { dbConnect } from "@/lib/mongodb";
import Faculty from "@/models/Faculty";
import StaticPage from "@/models/StaticPage";

export const metadata = {
    title: "Leadership Messages | MP Public School",
    description: "Read messages from our Principal and Director about our vision for empowering young minds and our commitment to academic excellence.",
};

export default async function PrincipalMessagePage() {
    await dbConnect();

    // Fetch Principal and Director from Faculty model
    const [principal, director, leadershipPage] = await Promise.all([
        Faculty.findOne({ designation: /Principal/i, isActive: true, schoolIds: process.env.SCHOOL_ID }).lean(),
        Faculty.findOne({ designation: /Director/i, isActive: true, schoolIds: process.env.SCHOOL_ID }).lean(),
        StaticPage.findOne({ slug: "about-leadership", schoolIds: process.env.SCHOOL_ID }).lean()
    ]);

    const principalContent = {
        name: principal?.name || "Dr. Rajesh Sharma",
        designation: principal?.designation || "Principal",
        image: principal?.imageUrl || "/images/leadership/principal.png",
        qualification: principal?.qualification || "M.Ed, Ph.D in Educational Leadership",
        experience: principal?.experience || "25+ Years in Education",
        message: leadershipPage?.sections?.find((s: any) => s.title.toLowerCase().includes("principal"))?.content || principal?.bio || `Dear Parents, Students, and Well-wishers,
        Welcome to MP Public School, where we believe that education is the most powerful weapon which you can use to change the world. Our mission is to nurture children into confident, disciplined, and responsible citizens who are prepared to face the challenges of the 21st century.`,
        quote: "Education is not the filling of a pail, but the lighting of a fire. We strive to ignite that spark of curiosity in every heart."
    };

    const directorContent = {
        name: director?.name || "Ms. Priya Sharma",
        designation: director?.designation || "Director",
        image: director?.imageUrl || "/images/leadership/director.png",
        qualification: director?.qualification || "MBA in Educational Management",
        experience: director?.experience || "20+ Years Excellence Awardee",
        message: leadershipPage?.sections?.find((s: any) => s.title.toLowerCase().includes("director"))?.content || director?.bio || `At MP Public School, our vision is to create a global community of lifelong learners. We are committed to providing an education that balances traditional integrity with modern innovation, ensuring our students are equipped to lead with empathy and wisdom.`,
        quote: "Our goal is to foster an environment where every student discovers their true potential and contributes meaningfully to society."
    };

    return (
        <AboutPageLayout
            title={leadershipPage?.title || "Messages from Leadership"}
            subtitle={leadershipPage?.subtitle || "From the Desk"}
            description={leadershipPage?.description || "Empowering young minds through visionary leadership and a commitment to academic excellence."}
            icon="users"
        >
            <div className="relative space-y-24 py-8 overflow-hidden">
                {/* Principal's Message Section */}
                <section className="relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        {/* Profile Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-4"
                        >
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-linear-to-tr from-primary/20 to-secondary/20 rounded-4xl blur-2xl group-hover:opacity-100 transition-opacity opacity-0" />
                                <div className="relative aspect-4/5 rounded-4xl overflow-hidden border-8 border-white shadow-2xl">
                                    <Image
                                        src={principalContent.image}
                                        alt={principalContent.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 space-y-4">
                                <div>
                                    <h3 className="text-2xl font-playfair font-bold text-primary">{principalContent.name}</h3>
                                    <p className="text-gold font-bold text-sm tracking-widest uppercase mt-1">{principalContent.designation}</p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center">
                                            <GraduationCap className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="text-sm font-medium">{principalContent.qualification}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center">
                                            <Briefcase className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="text-sm font-medium">{principalContent.experience}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Message Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-8 lg:pl-8 border-l border-gray-100"
                        >
                            <h2 className="text-3xl font-playfair font-bold text-primary mb-8 flex items-center gap-3">
                                <span className="w-12 h-[2px] bg-gold" />
                                From the Principal's Desk
                            </h2>

                            <div className="prose prose-lg text-gray-600 space-y-6 max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: principalContent.message }} className="leading-relaxed" />

                                <blockquote className="relative p-8 bg-surface rounded-3xl border-l-4 border-gold shadow-sm overflow-hidden group">
                                    <Quote className="absolute -top-2 -left-2 w-16 h-16 text-gold/10 -rotate-12 transition-transform group-hover:rotate-0" />
                                    <p className="relative z-10 text-xl font-playfair italic font-medium text-primary">
                                        "{principalContent.quote}"
                                    </p>
                                </blockquote>

                                <div className="pt-8">
                                    <p className="text-primary font-bold">Warm Regards,</p>
                                    <div className="mt-2 flex flex-col">
                                        <span className="text-3xl font-playfair italic text-primary/80 signature-font">{principalContent.name}</span>
                                        <span className="text-xs font-bold text-gold uppercase tracking-wider mt-1">{principalContent.designation}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <hr className="border-gray-100" />

                {/* Director's Message Section */}
                <section className="relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        {/* Message Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-8 lg:pr-8 order-2 lg:order-1 border-r border-gray-100"
                        >
                            <h2 className="text-3xl font-playfair font-bold text-primary mb-8 flex items-center justify-end gap-3 text-right">
                                Director's Message
                                <span className="w-12 h-[2px] bg-gold" />
                            </h2>

                            <div className="prose prose-lg text-gray-600 space-y-6 max-w-none text-right flex flex-col items-end">
                                <div dangerouslySetInnerHTML={{ __html: directorContent.message }} className="leading-relaxed" />

                                <div className="p-8 bg-primary/5 rounded-3xl border-r-4 border-primary shadow-sm text-right w-full">
                                    <p className="text-xl font-playfair italic font-medium text-primary">
                                        "{directorContent.quote}"
                                    </p>
                                </div>

                                <div className="pt-8 text-right">
                                    <p className="text-primary font-bold">Best Wishes,</p>
                                    <div className="mt-2 flex flex-col items-end">
                                        <span className="text-3xl font-playfair italic text-primary/80">{directorContent.name}</span>
                                        <span className="text-xs font-bold text-gold uppercase tracking-wider mt-1">{directorContent.designation}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Profile Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-4 order-1 lg:order-2"
                        >
                            <div className="relative group">
                                <div className="absolute -inset-2 bg-linear-to-tr from-accent/20 to-gold/10 rounded-5xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative aspect-4/5 rounded-4xl overflow-hidden border-4 border-white shadow-2xl">
                                    <Image
                                        src={directorContent.image}
                                        alt={directorContent.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 space-y-4 text-right">
                                <div>
                                    <h3 className="text-2xl font-playfair font-bold text-primary">{directorContent.name}</h3>
                                    <p className="text-gold font-bold text-sm tracking-widest uppercase mt-1">{directorContent.designation}</p>
                                </div>

                                <div className="flex flex-col items-end space-y-3">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <span className="text-sm font-medium">{directorContent.qualification}</span>
                                        <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center">
                                            <GraduationCap className="w-4 h-4 text-primary" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <span className="text-sm font-medium">{directorContent.experience}</span>
                                        <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center">
                                            <Briefcase className="w-4 h-4 text-primary" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </AboutPageLayout>
    );
}
