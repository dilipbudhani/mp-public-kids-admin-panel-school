"use client";

import React, { useState, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Phone, Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

// ─── Nav data ────────────────────────────────────────────────────────────────

const NAV_MENUS = [
    {
        id: "about",
        label: "About Us",
        activePrefix: ["/about", "/faculty", "/alumni", "/careers", "/virtual-tour", "/testimonials", "/success-stories"],
        links: [
            { name: "Overview", href: "/about" },
            { name: "Principal's Message", href: "/about/principal" },
            { name: "Our Faculty", href: "/faculty" },
            { name: "Alumni", href: "/alumni" },
            { name: "Testimonials", href: "/testimonials" },
            { name: "Success Stories", href: "/success-stories" },
            { name: "Careers", href: "/careers" },
            { name: "Virtual Tour", href: "/virtual-tour" },
        ],
    },
    {
        id: "academics",
        label: "Academics",
        activePrefix: ["/academics", "/academic-calendar", "/achievements", "/cbse-disclosure", "/downloads", "/results"],
        links: [
            { name: "Curriculum Overview", href: "/academics" },
            { name: "Pre-Primary (Nursery–UKG)", href: "/academics/pre-primary" },
            { name: "Primary (I–V)", href: "/academics/primary" },
            { name: "Middle (VI–VIII)", href: "/academics/middle" },
            { name: "Secondary (IX–X)", href: "/academics/secondary" },
            { name: "Senior Secondary (XI–XII)", href: "/academics/senior-secondary" },
            { name: "Academic Calendar", href: "/academic-calendar" },
            { name: "Results & Achievements", href: "/achievements" },
        ],
    },
    {
        id: "admissions",
        label: "Admissions",
        activePrefix: ["/admissions", "/fee-structure"],
        links: [
            { name: "Admission Overview", href: "/admissions" },
            { name: "RTE Admissions", href: "/admissions/rte" },
            { name: "Check Admission Status", href: "/admissions/status" },
            { name: "Fee Structure", href: "/fee-structure" },
            { name: "Apply Online", href: "/admissions/apply" },
        ],
    },
    {
        id: "campus",
        label: "Campus Life",
        activePrefix: ["/facilities", "/gallery", "/notices", "/transport", "/co-curricular", "/life-at-school"],
        links: [
            { name: "Facilities Overview", href: "/facilities" },
            { name: "Classrooms", href: "/facilities/classrooms" },
            { name: "Library", href: "/facilities/library" },
            { name: "Sports", href: "/facilities/sports" },
            { name: "Co-Curricular", href: "/co-curricular" },
            { name: "Gallery", href: "/gallery" },
            { name: "Notice Board", href: "/notices" },
        ],
    },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function Navbar({ settings }: { settings?: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHeroDark, setIsHeroDark] = useState(false);
    const [activeMega, setActiveMega] = useState<string | null>(null);
    const [openMobile, setOpenMobile] = useState<string | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 80);
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Detect if the current page has a dark hero section.
    // useLayoutEffect runs before paint → prevents flicker.
    useLayoutEffect(() => {
        const checkHeroTheme = () => {
            const heroElement = document.querySelector('[data-hero-dark="true"]');
            if (heroElement) {
                const rect = heroElement.getBoundingClientRect();
                // Consider it a dark hero only if it's at the top of the viewport
                setIsHeroDark(rect.top <= 100 && rect.bottom >= 0);
            } else {
                setIsHeroDark(false);
            }
        };

        checkHeroTheme();
        const frame = requestAnimationFrame(checkHeroTheme);
        const timer = setTimeout(checkHeroTheme, 100);

        return () => {
            cancelAnimationFrame(frame);
            clearTimeout(timer);
        };
    }, [pathname]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
        setOpenMobile(null);
    }, [pathname]);

    // theme === 'light' → white text / transparent bg (dark hero at top)
    // theme === 'dark'  → dark text / white bg (scrolled or light page)
    const activeTheme = isScrolled ? "dark" : isHeroDark ? "light" : "dark";

    /** Check whether a dropdown menu should appear highlighted */
    const isMenuActive = (menu: typeof NAV_MENUS[number]) =>
        menu.activePrefix.some((prefix) => pathname.startsWith(prefix));

    return (
        <nav
            className={cn(
                "fixed top-0 lg:py-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out print:hidden",
                activeTheme === "dark"
                    ? "bg-white shadow-md py-2"
                    : "bg-primary/95 lg:bg-transparent py-4"
            )}
        >
            {/* Top Bar (Desktop Only) - Show only on dark heroes at top */}
            {!isScrolled && isHeroDark && (
                <div className="hidden lg:block bg-primary border-b border-white/10 py-2">
                    <div className="container flex justify-between items-center text-xs text-white/80 tracking-wider font-medium">
                        <div className="flex items-center gap-6">
                            <span className="flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-gold" /> {settings?.contactPhone || "+91 98765 43210"}
                            </span>
                            <span className="flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-gold" /> {settings?.contactEmail || "info@mpkidsschool.edu.in"}
                            </span>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-gold" /> {settings?.address?.split(',').slice(-2).join(',').trim() || "New Delhi, India"}
                            </span>
                            <Link href="/admissions" className="text-gold hover:text-white transition-colors">
                                CBSE Affiliation: {settings?.cbseAffiliation || "1234567"}
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <div className="container">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex flex-col">
                        <span
                            className={cn(
                                "font-playfair font-bold text-xl leading-none transition-colors",
                                activeTheme === "dark" ? "text-primary" : "text-white"
                            )}
                        >
                            {settings?.schoolName || "MP Kids School"}
                        </span>
                    </Link>

                    {/* ── Desktop Nav ───────────────────────────────────── */}
                    <div className="hidden lg:flex items-center gap-8">
                        <NavLink href="/" active={pathname === "/"} theme={activeTheme}>
                            Home
                        </NavLink>

                        {/* Dropdown menus */}
                        {NAV_MENUS.map((menu) => (
                            <div
                                key={menu.id}
                                className="relative group py-4"
                                onMouseEnter={() => setActiveMega(menu.id)}
                                onMouseLeave={() => setActiveMega(null)}
                            >
                                <button
                                    className={cn(
                                        "flex items-center gap-1 font-medium text-sm uppercase tracking-wider transition-colors",
                                        activeTheme === "dark"
                                            ? "text-primary hover:text-accent"
                                            : "text-white hover:text-gold",
                                        isMenuActive(menu) &&
                                        (activeTheme === "dark" ? "text-accent" : "text-gold")
                                    )}
                                >
                                    {menu.label}
                                    <ChevronDown
                                        className={cn(
                                            "w-4 h-4 transition-transform duration-200",
                                            activeMega === menu.id && "rotate-180"
                                        )}
                                    />
                                </button>

                                <AnimatePresence>
                                    {activeMega === menu.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.18, ease: "easeOut" }}
                                            className="absolute top-full left-1/2 -translate-x-1/2 min-w-[220px] bg-white shadow-xl border-t-2 border-accent p-2 grid gap-0.5"
                                        >
                                            {menu.links.map((link) => {
                                                const isActive = pathname === link.href;
                                                return (
                                                    <Link
                                                        key={link.href}
                                                        href={link.href}
                                                        className={cn(
                                                            "block px-4 py-2.5 text-sm transition-all font-medium rounded-sm",
                                                            isActive
                                                                ? "text-accent font-bold bg-surface"
                                                                : "text-text hover:bg-surface hover:text-accent"
                                                        )}
                                                    >
                                                        {link.name}
                                                    </Link>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}

                        {/* Contact — direct link, no dropdown */}
                        <NavLink href="/contact" active={pathname === "/contact"} theme={activeTheme}>
                            Contact Us
                        </NavLink>

                        <Link href="/admissions" className="btn btn-secondary px-8 h-10 text-xs">
                            Apply Now
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden p-2"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? (
                            <X className={cn("w-6 h-6", activeTheme === "dark" ? "text-primary" : "text-white")} />
                        ) : (
                            <Menu className={cn("w-6 h-6", activeTheme === "dark" ? "text-primary" : "text-white")} />
                        )}
                    </button>
                </div>
            </div>

            {/* ── Mobile Drawer ─────────────────────────────────────────── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.28 }}
                        className="fixed inset-0 top-[60px] bg-white z-40 lg:hidden overflow-y-auto"
                    >
                        <div className="flex flex-col p-6 gap-1">
                            {/* Home */}
                            <MobileNavLink href="/" active={pathname === "/"}>
                                Home
                            </MobileNavLink>

                            {/* Accordion menus */}
                            {NAV_MENUS.map((menu) => {
                                const isExpanded = openMobile === menu.id;
                                const menuActive = isMenuActive(menu);
                                return (
                                    <div key={menu.id} className="border-b border-gray-100">
                                        <button
                                            onClick={() =>
                                                setOpenMobile(isExpanded ? null : menu.id)
                                            }
                                            className={cn(
                                                "w-full flex items-center justify-between py-4 text-base font-bold uppercase tracking-wide transition-colors",
                                                menuActive ? "text-accent" : "text-primary"
                                            )}
                                        >
                                            {menu.label}
                                            <ChevronDown
                                                className={cn(
                                                    "w-5 h-5 transition-transform duration-200",
                                                    isExpanded && "rotate-180"
                                                )}
                                            />
                                        </button>

                                        <AnimatePresence initial={false}>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.22, ease: "easeInOut" }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="grid gap-1 pl-4 pb-4">
                                                        {menu.links.map((link) => {
                                                            const isActive = pathname === link.href;
                                                            return (
                                                                <Link
                                                                    key={link.href}
                                                                    href={link.href}
                                                                    className={cn(
                                                                        "py-2 text-sm font-medium transition-colors",
                                                                        isActive
                                                                            ? "text-accent font-bold"
                                                                            : "text-text"
                                                                    )}
                                                                >
                                                                    {link.name}
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}

                            {/* Contact — direct link */}
                            <MobileNavLink href="/contact" active={pathname === "/contact"}>
                                Contact Us
                            </MobileNavLink>

                            <Link href="/admissions" className="btn btn-secondary w-full mt-6">
                                Apply Now 2025-26
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

// ─── Helper components ────────────────────────────────────────────────────────

function NavLink({
    href,
    children,
    active,
    theme,
}: {
    href: string;
    children: React.ReactNode;
    active?: boolean;
    theme?: "light" | "dark";
}) {
    return (
        <Link
            href={href}
            className={cn(
                "font-medium text-sm uppercase tracking-wider transition-all relative group",
                active
                    ? theme === "dark" ? "text-accent" : "text-gold"
                    : theme === "dark" ? "text-primary hover:text-accent" : "text-white hover:text-gold"
            )}
        >
            {children}
            <span
                className={cn(
                    "absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full",
                    theme === "dark" ? "bg-accent" : "bg-gold",
                    active && "w-full"
                )}
            />
        </Link>
    );
}

function MobileNavLink({
    href,
    children,
    active,
}: {
    href: string;
    children: React.ReactNode;
    active?: boolean;
}) {
    return (
        <Link
            href={href}
            className={cn(
                "py-4 text-base font-bold uppercase tracking-wide border-b border-gray-100 transition-colors",
                active ? "text-accent" : "text-primary"
            )}
        >
            {children}
        </Link>
    );
}
