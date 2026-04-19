"use client";

import React from "react";
import { UtilityPageLayout } from "@/components/layout/UtilityPageLayout";
import { Network as SitemapIcon, ChevronRight } from "lucide-react";
import Link from "next/link";

const SITEMAP_DATA = [
    {
        category: "Institutional",
        links: [
            { name: "Home", href: "/" },
            { name: "About Overview", href: "/about/overview" },
            { name: "Vision & Mission", href: "/about/vision" },
            { name: "Leadership", href: "/about/leadership" },
            { name: "History & Legacy", href: "/about/history" },
        ]
    },
    {
        category: "Academic Wings",
        links: [
            { name: "Pre-Primary Wing", href: "/academics/pre-primary" },
            { name: "Primary Wing", href: "/academics/primary" },
            { name: "Secondary Wing", href: "/academics/secondary" },
            { name: "Faculty Directory", href: "/academics/faculty" },
        ]
    },
    {
        category: "Campus Facilities",
        links: [
            { name: "Facilities Overview", href: "/facilities" },
            { name: "Classrooms", href: "/facilities?section=classrooms" },
            { name: "Science Labs", href: "/facilities?section=labs" },
            { name: "Digital Library", href: "/facilities?section=library" },
            { name: "Sports Infrastructure", href: "/facilities?section=sports" },
        ]
    },
    {
        category: "Admissions & Support",
        links: [
            { name: "Admission Process", href: "/admissions" },
            { name: "Contact Us", href: "/contact" },
            { name: "News & Announcements", href: "/#news" },
        ]
    },
    {
        category: "Legal & Legal",
        links: [
            { name: "Privacy Policy", href: "/privacy-policy" },
            { name: "Terms of Use", href: "/terms" },
            { name: "Disclaimer", href: "/disclaimer" },
        ]
    }
];

export default function SitemapPage() {
    return (
        <UtilityPageLayout
            title="Sitemap"
            subtitle="Website Structure"
            description="A comprehensive map of all sections and pages within the MP Public School portal."
            icon="sitemap"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {SITEMAP_DATA.map((section, idx) => (
                    <div key={idx} className="space-y-4">
                        <h2 className="text-xl font-playfair font-bold text-primary border-b border-gray-100 pb-2">
                            {section.category}
                        </h2>
                        <div className="grid gap-2">
                            {section.links.map((link, lIdx) => (
                                <Link
                                    key={lIdx}
                                    href={link.href}
                                    className="flex items-center gap-2 group text-gray-600 hover:text-accent transition-colors py-1"
                                >
                                    <ChevronRight className="w-3 h-3 text-gold group-hover:translate-x-1 transition-transform" />
                                    <span className="text-sm font-medium">{link.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </UtilityPageLayout>
    );
}
