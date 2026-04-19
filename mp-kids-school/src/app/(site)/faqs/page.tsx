"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, MessageCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const FAQS = [
    {
        category: "Admissions",
        items: [
            {
                question: "What is the admission process for the new academic year?",
                answer: "The admission process typically starts in December. Parents can fill out the online application form or visit the school office. Required documents include the birth certificate, previous school records, and photographs.",
            },
            {
                question: "What is the minimum age for Nursery admission?",
                answer: "Child should be 3+ years as of 31st March of the academic year for which admission is sought.",
            },
            {
                question: "Do you offer RTE admissions?",
                answer: "Yes, we comply with the Right to Education (RTE) Act and have reserved seats for economically weaker sections as per government norms.",
            },
        ],
    },
    {
        category: "Academics",
        items: [
            {
                question: "Which board is the school affiliated with?",
                answer: "MP Kids School is fully affiliated with the Central Board of Secondary Education (CBSE), New Delhi.",
            },
            {
                question: "What is the student-teacher ratio?",
                answer: "We maintain a student-teacher ratio of 25:1 to ensure personalized attention for every child.",
            },
            {
                question: "What extra-curricular activities are offered?",
                answer: "We offer a wide range of activities including music, dance, art, swimming, skating, and various sports like cricket and football.",
            },
        ],
    },
    {
        category: "Facilities",
        items: [
            {
                question: "Does the school provide transport facilities?",
                answer: "Yes, we have a fleet of GPS-enabled buses covering major routes in the city. Each bus has a female attendant for safety.",
            },
            {
                question: "Is there a school canteen?",
                answer: "Yes, we provide healthy and hygienic meals in our school cafeteria. The menu is planned by a nutritionist.",
            },
        ],
    },
];

export default function FAQPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [openIndex, setOpenIndex] = useState<string | null>(null);

    const filteredFaqs = FAQS.map(cat => ({
        ...cat,
        items: cat.items.filter(
            item =>
                item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => cat.items.length > 0);

    return (
        <main className="min-h-screen pt-24 pb-20 bg-surface">
            {/* Hero Section */}
            <section className="bg-primary py-20 px-4 relative overflow-hidden" data-hero-dark="true">
                <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10" />
                <div className="container relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-6">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-white/80 text-lg mb-8">
                            Find answers to common questions about admissions, academics, and school life.
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search your question here..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FAQ Sections */}
            <section className="container py-16 px-4">
                <div className="max-w-3xl mx-auto">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((category, catIdx) => (
                            <div key={category.category} className="mb-12">
                                <h2 className="text-2xl font-playfair font-bold text-primary mb-6 flex items-center gap-3">
                                    <HelpCircle className="text-accent w-6 h-6" />
                                    {category.category}
                                </h2>
                                <div className="space-y-4">
                                    {category.items.map((faq, faqIdx) => {
                                        const id = `${catIdx}-${faqIdx}`;
                                        const isOpen = openIndex === id;
                                        return (
                                            <motion.div
                                                key={id}
                                                initial={false}
                                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                                            >
                                                <button
                                                    onClick={() => setOpenIndex(isOpen ? null : id)}
                                                    className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-gray-50"
                                                >
                                                    <span className="font-bold text-primary pr-8">
                                                        {faq.question}
                                                    </span>
                                                    <ChevronDown
                                                        className={cn(
                                                            "w-5 h-5 text-accent transition-transform duration-300",
                                                            isOpen && "rotate-180"
                                                        )}
                                                    />
                                                </button>
                                                <AnimatePresence initial={false}>
                                                    {isOpen && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                                        >
                                                            <div className="p-5 pt-0 text-text/80 leading-relaxed border-t border-gray-50 bg-surface/30">
                                                                {faq.answer}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-xl text-text/60">No questions found matching your search.</p>
                            <button
                                onClick={() => setSearchQuery("")}
                                className="mt-4 text-accent font-bold hover:underline"
                            >
                                Clear search
                            </button>
                        </div>
                    )}

                    {/* Contact CTA */}
                    <div className="mt-20 p-8 rounded-2xl bg-white border-2 border-dashed border-accent/20 text-center">
                        <MessageCircle className="w-12 h-12 text-accent mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-primary mb-2">Still have questions?</h3>
                        <p className="text-text/70 mb-6">
                            Can't find the answer you're looking for? Please contact our friendly team.
                        </p>
                        <a
                            href="/contact"
                            className="btn btn-primary px-8"
                        >
                            Get in Touch
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
