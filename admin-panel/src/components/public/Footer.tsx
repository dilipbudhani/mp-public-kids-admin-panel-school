import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail, ChevronRight } from "lucide-react";
import { dbConnect } from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";

export async function Footer() {
    await dbConnect();
    const settings = await SiteSettings.findOne();

    const sections = [
        {
            title: "Quick Links",
            links: [
                { name: "About Us", href: "/about" },
                { name: "Admissions", href: "/admissions" },
                { name: "Academics", href: "/academics" },
                { name: "Infrastructure", href: "/infrastructure" },
                { name: "Mandatory Disclosure", href: "/disclosure" },
            ]
        },
        {
            title: "Resources",
            links: [
                { name: "School Calendar", href: "/calendar" },
                { name: "News & Events", href: "/news" },
                { name: "Photo Gallery", href: "/gallery" },
                { name: "Career", href: "/career" },
                { name: "Privacy Policy", href: "/privacy" },
            ]
        }
    ];

    return (
        <footer className="bg-slate-900 text-white pt-24 pb-12 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -mr-48 -mt-48" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
                    {/* Brand Section */}
                    <div className="space-y-8">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-2xl">
                                <span className="font-black text-2xl">M</span>
                            </div>
                            <div>
                                <span className="block font-black text-white leading-none text-xl">MP KIDS</span>
                                <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Global Excellence</span>
                            </div>
                        </Link>
                        <p className="text-slate-400 font-medium leading-relaxed italic">
                            "Nurturing curiosity, fostering creativity, and building future leaders in a premium educational environment."
                        </p>
                        <div className="flex items-center gap-4">
                            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link Sections */}
                    {sections.map((section) => (
                        <div key={section.title} className="space-y-8">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary">{section.title}</h4>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group text-sm font-bold"
                                        >
                                            <ChevronRight className="w-3 h-3 text-primary opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact Section */}
                    <div className="space-y-8">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Contact Us</h4>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary flex-shrink-0">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                                    {settings?.address || "123 Education Lane, Digital City, ST 12345"}
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary flex-shrink-0">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <p className="text-sm text-slate-400 font-bold">
                                    {settings?.contactPhone || "+91 90919 29384"}
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary flex-shrink-0">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <p className="text-sm text-slate-400 font-bold">
                                    {settings?.contactEmail || "hello@mpkids.school"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                        © {new Date().getFullYear()} MP Kids Global School. All Rights Reserved.
                    </p>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        Designed with
                        <span className="text-rose-500 animate-pulse">❤️</span>
                        for Future Leaders
                    </p>
                </div>
            </div>
        </footer>
    );
}
