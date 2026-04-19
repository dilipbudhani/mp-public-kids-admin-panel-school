"use client";

import React from "react";
import { User } from "next-auth";
import { Bell, Search, User as UserIcon } from "lucide-react";
import { SchoolSwitcher } from "./SchoolSwitcher";

interface AdminHeaderProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    } | undefined;
}

export function AdminHeader({ user }: AdminHeaderProps) {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10">
            <div className="flex items-center gap-4 text-gray-400">
                <div className="relative group lg:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search dashboard..."
                        className="w-full bg-gray-50 border border-gray-100 rounded-lg py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <SchoolSwitcher />

                <button className="relative text-gray-500 hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-50">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-gray-900 leading-none">{user?.name || "Admin"}</p>
                        <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                        <UserIcon className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </header>
    );
}
