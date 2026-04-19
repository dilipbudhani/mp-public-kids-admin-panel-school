"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    Search,
    Download,
    Calendar,
    Info,
    Mail
} from "lucide-react";

// --- Types ---
type Category = "All" | "Circular" | "Date Sheet" | "Syllabus" | "Admission Form" | "Other";

interface DownloadItem {
    _id: string;
    title: string;
    category: Exclude<Category, "All">;
    description: string;
    pdfUrl?: string;
    date: string;
}

const CATEGORIES: Category[] = [
    "All",
    "Circular",
    "Date Sheet",
    "Syllabus",
    "Admission Form",
    "Other"
];

const DownloadIcon = ({ category }: { category: string }) => {
    switch (category) {
        case "Circular": return <FileText className="w-8 h-8 text-red-500" />;
        case "Syllabus": return <FileText className="w-8 h-8 text-blue-500" />;
        case "Date Sheet": return <FileText className="w-8 h-8 text-green-500" />;
        default: return <FileText className="w-8 h-8 text-slate-500" />;
    }
};

interface DownloadsClientProps {
    pageData: any;
}

export default function DownloadsClient({ pageData }: DownloadsClientProps) {
    const [downloads, setDownloads] = useState<DownloadItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<Category>("All");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchDownloads = async () => {
            try {
                const res = await fetch('/api/circulars');
                if (res.ok) {
                    const data = await res.json();
                    setDownloads(data);
                }
            } catch (error) {
                console.error("Failed to fetch downloads:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDownloads();
    }, []);

    const filteredDownloads = useMemo(() => {
        return downloads.filter((item) => {
            const matchesCategory = activeCategory === "All" || item.category === activeCategory;
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery, downloads]);

    const title = pageData?.title || "Downloads & Resources";
    const description = pageData?.description || "Find and download all essential admission forms, academic resources, circulars, and syllabi from our centralized repository.";
    const supportSection = pageData?.sections?.find((s: any) => s.title === 'Support');

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <section data-hero-dark="true" className="relative bg-[#002147] pt-32 pb-16 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/20 rounded-full blur-3xl -ml-48 -mb-48" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6">
                            {title.split(' & ')[0]} & <span className="text-[#D4AF37]">{title.split(' & ')[1] || "Resources"}</span>
                        </h1>
                        <p className="text-xl text-slate-200 max-w-2xl mx-auto mb-12 font-inter leading-relaxed">
                            {description}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="container mx-auto px-4 py-16 -mt-8 relative z-20">
                {/* Search and Filter Container */}
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-12 border border-slate-100">
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                        {/* Search Bar */}
                        <div className="relative w-full lg:max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                id="search-files"
                                type="text"
                                placeholder="Search documents by name..."
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002147]/10 focus:border-[#002147] transition-all font-inter"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Category Filter Tabs */}
                        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                            {CATEGORIES.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 font-inter ${activeCategory === category
                                        ? "bg-[#002147] text-white shadow-lg shadow-[#002147]/20"
                                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results Info */}
                <div className="flex items-center justify-between mb-8 px-2">
                    <p className="text-slate-500 font-inter">
                        {isLoading ? "Loading documents..." : (
                            <>Showing <span className="text-[#002147] font-bold">{filteredDownloads.length}</span> documents</>
                        )}
                    </p>
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="text-[#002147] text-sm font-semibold hover:underline"
                        >
                            Clear Search
                        </button>
                    )}
                </div>

                {/* Downloads Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        [1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white rounded-2xl p-6 h-64 animate-pulse border border-slate-100" />
                        ))
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filteredDownloads.map((item) => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#D4AF37]/30 transition-all duration-300 flex flex-col h-full"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-[#002147]/5 transition-colors">
                                            <DownloadIcon category={item.category} />
                                        </div>
                                        <span className="px-3 py-1 bg-[#002147]/5 text-[#002147] text-[10px] font-black uppercase tracking-widest rounded-full font-inter">
                                            {item.category}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-playfair font-bold text-[#002147] mb-2 line-clamp-2 min-h-14 group-hover:text-[#D4AF37] transition-colors">
                                        {item.title}
                                    </h3>

                                    <p className="text-slate-500 text-sm font-inter mb-6 line-clamp-2 grow">
                                        {item.description}
                                    </p>

                                    <div className="flex items-center gap-4 text-xs text-slate-400 font-inter mb-6">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </div>

                                    {item.pdfUrl ? (
                                        <a
                                            href={item.pdfUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full inline-flex items-center justify-center gap-2 bg-[#002147] text-white py-3.5 rounded-xl font-bold hover:bg-[#D4AF37] hover:text-[#002147] transition-all duration-300 group/btn"
                                        >
                                            <Download className="w-5 h-5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                            Download Resource
                                        </a>
                                    ) : (
                                        <div className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-400 py-3.5 rounded-xl font-bold cursor-not-allowed">
                                            <Info className="w-5 h-5" />
                                            Attachment Unavailable
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {/* Empty State */}
                {!isLoading && filteredDownloads.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 bg-white rounded-4xl border-2 border-dashed border-slate-200"
                    >
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-playfair font-bold text-[#002147] mb-2">No documents found</h3>
                        <p className="text-slate-500 font-inter max-w-md mx-auto">
                            We couldn't find any documents matching "{searchQuery}" in the {activeCategory} category.
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setActiveCategory("All");
                            }}
                            className="mt-6 text-[#002147] font-bold hover:underline"
                        >
                            Reset all filters
                        </button>
                    </motion.div>
                )}
            </section>

            {/* Support Section */}
            <section className="container mx-auto px-4 pb-24">
                <div className="bg-linear-to-r from-[#002147] to-[#003366] rounded-4xl p-8 md:p-12 text-center text-white relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <FileText className="w-48 h-48 rotate-12" />
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
                            {supportSection?.title || "Can't find what you're looking for?"}
                        </h2>
                        <p className="text-slate-200 font-inter text-lg mb-8 max-w-2xl mx-auto">
                            {supportSection?.content || "If a specific form or document is not available here, please reach out to our administrative office for assistance."}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="mailto:info@mpkidsschool.edu.in"
                                className="bg-white text-[#002147] px-8 py-4 rounded-xl font-bold hover:bg-[#D4AF37] transition-colors flex items-center gap-2 shadow-xl shadow-black/10"
                            >
                                <Mail className="w-5 h-5" />
                                Contact Office
                            </a>
                            <div className="text-slate-300 text-sm italic">
                                Response time: Within 24-48 business hours
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
