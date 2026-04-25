"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, School } from "lucide-react";
import { cn } from "@/lib/utils";

const SCHOOLS = [
    { id: "mp-kids-school", name: "MP Kids School" },
    { id: "mp-public", name: "MP Public School" },
];

export function SchoolSwitcher() {
    const [selectedSchool, setSelectedSchool] = useState<string>("mp-kids-school");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const savedSchool = localStorage.getItem("selectedSchool");
        if (savedSchool) {
            setSelectedSchool(savedSchool);
            // Sync cookie if not already set or different
            document.cookie = `selectedSchool=${savedSchool}; path=/; max-age=31536000; SameSite=Lax`;
        }
    }, []);

    const handleSwitch = (id: string) => {
        setSelectedSchool(id);
        localStorage.setItem("selectedSchool", id);
        document.cookie = `selectedSchool=${id}; path=/; max-age=31536000; SameSite=Lax`;
        setIsOpen(false);
        // Refresh the page to reload data with new schoolId
        window.location.reload();
    };

    const currentSchool = SCHOOLS.find(s => s.id === selectedSchool) || SCHOOLS[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all"
            >
                <School className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-gray-700" suppressHydrationWarning>{currentSchool.name}</span>
                <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-20"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-30 py-1 overflow-hidden">
                        {SCHOOLS.map((school) => (
                            <button
                                key={school.id}
                                onClick={() => handleSwitch(school.id)}
                                className={cn(
                                    "w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between",
                                    selectedSchool === school.id
                                        ? "bg-primary/5 text-primary font-semibold"
                                        : "text-gray-600 hover:bg-gray-50"
                                )}
                            >
                                {school.name}
                                {selectedSchool === school.id && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
