import React from "react";
import Link from "next/link";
import { dbConnect } from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";

export async function Navbar() {
    await dbConnect();
    const settings = await SiteSettings.findOne();

    const navLinks = [
        { name: "About", href: "/about" },
        { name: "Academics", href: "/academics" },
        { name: "Infrastructure", href: "/infrastructure" },
        { name: "Beyond Academics", href: "/beyond-academics" },
        { name: "Admissions", href: "/admissions" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-2xl border-b border-slate-100 transition-all duration-500">
            <nav className="container mx-auto px-6">
                <div className="h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-xl shadow-primary/20 group-hover:scale-110 transition-all duration-500">
                            <span className="font-black text-xl">M</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-slate-900 leading-none text-lg">MP KIDS</span>
                            <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mt-1">Global School</span>
                        </div>
                    </Link>

                    <div className="hidden lg:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors relative group"
                            >
                                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full" />
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/admissions"
                            className="bg-slate-900 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl hover:-translate-y-0.5"
                        >
                            Apply Now
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
}
