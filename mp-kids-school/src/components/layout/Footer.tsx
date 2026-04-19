"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

const NAV_COLUMNS = [
    {
        heading: "About School",
        links: [
            { name: "About Us", href: "/about" },
            { name: "Principal's Message", href: "/about/principal" },
            { name: "Our Faculty", href: "/faculty" },
            { name: "Alumni", href: "/alumni" },
            { name: "Testimonials", href: "/testimonials" },
            { name: "Success Stories", href: "/success-stories" },
            { name: "Careers", href: "/careers" },
        ],
    },
    {
        heading: "Academics",
        links: [
            { name: "Overview", href: "/academics" },
            { name: "Academic Calendar", href: "/academic-calendar" },
            { name: "Results & Achievements", href: "/achievements" },
            { name: "CBSE Disclosure", href: "/cbse-disclosure" },
            { name: "Downloads", href: "/downloads" },
        ],
    },
    {
        heading: "Admissions",
        links: [
            { name: "Admissions Overview", href: "/admissions" },
            { name: "RTE Admissions", href: "/admissions/rte" },
            { name: "Check Status", href: "/admissions/status" },
            { name: "Fee Structure", href: "/fee-structure" },
            { name: "Apply Online", href: "/admissions/apply" },
        ],
    },
    {
        heading: "Campus Life",
        links: [
            { name: "Facilities", href: "/facilities" },
            { name: "Library", href: "/facilities/library" },
            { name: "Sports", href: "/facilities/sports" },
            { name: "Co-Curricular", href: "/co-curricular" },
            { name: "Gallery", href: "/gallery" },
            { name: "Notice Board", href: "/notices" },
        ],
    },
];

export function Footer({ settings }: { settings?: any }) {
    const [subscribed, setSubscribed] = useState(false);
    const pathname = usePathname();

    const schoolName = settings?.schoolName || "MP Kids School";
    const address = settings?.address || "123 Education Lane, Sector 45, New Delhi — 110070";
    const phone = settings?.contactPhone || "+91 (011) 2345 6789";
    const email = settings?.contactEmail || "info@mpkidsschool.edu.in";

    return (
        <footer className="bg-primary text-white pt-12 lg:pt-20 pb-10 border-t-4 border-gold print:hidden">
            <div className="container">
                {/* Main grid: 2-col on mobile → single col on xs, 5-col on lg */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-6 mb-16">

                    {/* Column 1: Branding + Newsletter + Socials */}
                    <div className="flex flex-col gap-6 sm:col-span-2 lg:col-span-2">
                        <Link href="/" className="flex flex-col">
                            <span className="font-playfair font-bold text-2xl leading-none text-white">
                                {schoolName}
                            </span>
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                            Empowering young minds through excellence in education, character building, and innovation. Affiliated with CBSE, New Delhi.
                        </p>

                        {/* Contact details */}
                        <div className="flex flex-col gap-3 text-sm text-white/70">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                                <span>{address}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-gold shrink-0" />
                                <span>{phone}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-gold shrink-0" />
                                <span>{email}</span>
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h5 className="font-bold text-white mb-3 text-sm">Subscribe to Newsletter</h5>
                            {subscribed ? (
                                <div className="text-sm text-green-400 font-medium py-2.5 px-4 bg-green-400/10 rounded border border-green-400/20 inline-block animate-in fade-in duration-300">
                                    ✓ You're subscribed!
                                </div>
                            ) : (
                                <form
                                    onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }}
                                    className="flex w-full max-w-xs"
                                >
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        required
                                        className="bg-white/5 border border-white/10 text-white text-sm rounded-l px-4 py-2.5 outline-none focus:border-gold w-full transition-colors"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-gold text-primary font-bold text-sm px-5 rounded-r hover:bg-white transition-colors"
                                    >
                                        Go
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Social icons */}
                        <div className="flex items-center gap-3 flex-wrap">
                            {settings?.facebookUrl && <SocialIcon icon={<Facebook className="w-5 h-5 fill-white" />} href={settings.facebookUrl} bgColor="bg-blue-600" />}
                            {settings?.twitterUrl && <SocialIcon icon={<Twitter className="w-4 h-4 fill-white" />} href={settings.twitterUrl} bgColor="bg-black border border-white/20" />}
                            {settings?.instagramUrl && <SocialIcon icon={<Instagram className="w-5 h-5" />} href={settings.instagramUrl} bgColor="bg-linear-to-tr from-yellow-400 via-pink-500 to-purple-600" />}
                            {settings?.youtubeUrl && <SocialIcon icon={<Youtube className="w-5 h-5 fill-white" />} href={settings.youtubeUrl} bgColor="bg-red-600" />}
                        </div>
                    </div>

                    {/* Columns 2–5: Nav link columns */}
                    {NAV_COLUMNS.map((col) => (
                        <div key={col.heading}>
                            <h4 className="font-playfair font-bold text-lg mb-6 text-white relative inline-block">
                                {col.heading}
                                <span className="absolute -bottom-2 left-0 w-10 h-0.5 bg-gold" />
                            </h4>
                            <ul className="grid gap-3 mt-2">
                                {col.links.map((link) => {
                                    const isActive = pathname === link.href;
                                    return (
                                        <li key={`${col.heading}-${link.href}`}>
                                            <Link
                                                href={link.href}
                                                className={`text-sm flex items-center gap-2 group transition-colors ${isActive
                                                    ? "text-gold font-bold"
                                                    : "text-white/70 hover:text-gold"
                                                    }`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full transition-transform group-hover:scale-150 ${isActive ? "bg-gold scale-150" : "bg-gold/50"
                                                        }`}
                                                />
                                                {link.name}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-sm text-white/40">
                        &copy; {new Date().getFullYear()} {schoolName}. All Rights Reserved.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 text-xs text-white/40 uppercase tracking-widest font-medium">
                        <Link href="/privacy-policy" className="hover:text-gold transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-gold transition-colors">Terms of Use</Link>
                        <Link href="/disclaimer" className="hover:text-gold transition-colors">Disclaimer</Link>
                        <Link href="/sitemap" className="hover:text-gold transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ icon, href, bgColor }: { icon: React.ReactNode; href: string; bgColor?: string }) {
    return (
        <Link
            href={href}
            className={`w-10 h-10 ${bgColor || "bg-white/5"} rounded-full border border-transparent flex items-center justify-center text-white hover:scale-110 shadow-sm hover:shadow-md transition-all duration-300`}
        >
            {icon}
        </Link>
    );
}
