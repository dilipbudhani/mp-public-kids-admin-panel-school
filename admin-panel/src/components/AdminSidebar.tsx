"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Inbox,
    ClipboardList,
    GraduationCap,
    MessageSquare,
    ImageIcon,
    Newspaper,
    Bell,
    Calendar,
    Users,
    History,
    Trophy,
    BarChart,
    TrendingUp,
    Briefcase,
    Star,
    Banknote,
    FileText,
    Settings,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const MENU_ITEMS = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Inbox, label: "Leads", href: "/admin/leads" },
    { icon: ClipboardList, label: "Admissions", href: "/admin/admissions" },
    { icon: GraduationCap, label: "Students", href: "/admin/students" },
    { icon: MessageSquare, label: "Notifications", href: "/admin/notifications" },
    { icon: ImageIcon, label: "Hero Slides", href: "/admin/hero" },
    { icon: Newspaper, label: "News & Stories", href: "/admin/news" },
    { icon: Bell, label: "Notice Board", href: "/admin/downloads" },
    { icon: Calendar, label: "Academic Calendar", href: "/admin/events" },
    { icon: Users, label: "Faculty", href: "/admin/faculty" },
    { icon: History, label: "Alumni", href: "/admin/alumni" },
    { icon: Trophy, label: "Success Stories", href: "/admin/success-stories" },
    { icon: BarChart, label: "Results", href: "/admin/results" },
    { icon: TrendingUp, label: "Stats", href: "/admin/stats" },
    { icon: Briefcase, label: "Careers", href: "/admin/careers" },
    { icon: ImageIcon, label: "Gallery", href: "/admin/gallery" },
    { icon: Star, label: "Testimonials", href: "/admin/testimonials" },
    { icon: Banknote, label: "Fees", href: "/admin/fees" },
    { icon: FileText, label: "Pages", href: "/admin/pages" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
            <div className="p-6 border-b border-gray-200">
                <Link href="/admin" className="flex items-center gap-2 font-bold text-xl text-primary font-playfair">
                    Admin Panel
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {MENU_ITEMS.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                            pathname === item.href
                                ? "bg-primary/10 text-primary"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={() => signOut({ callbackUrl: "/admin/login" })}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
