"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
    Trophy,
    Star,
    Award,
    TrendingUp,
    Target,
    Users,
    Medal,
    ChevronRight,
    GraduationCap
} from "lucide-react";
import Counter from "@/components/ui/Counter";

// --- Sample Data ---

const YEARS = ["2024", "2023", "2022", "2021", "2020"];

const BOARD_RESULTS = {
    "2024": [
        { class: "Class 10", pass: 100, above90: 24, above80: 45, studentCount: 156 },
        { class: "Class 12", pass: 98.5, above90: 18, above80: 38, studentCount: 142 },
    ],
    "2023": [
        { class: "Class 10", pass: 100, above90: 22, above80: 42, studentCount: 148 },
        { class: "Class 12", pass: 99.2, above90: 20, above80: 40, studentCount: 135 },
    ],
    // ... more years
};

const TOPPERS = {
    "2024": [
        { name: "Priya Sharma", class: "Class 12", stream: "Science", percentage: "98.8%", rank: 1, image: "PS" },
        { name: "Rahul Verma", class: "Class 12", stream: "Commerce", percentage: "97.5%", rank: 2, image: "RV" },
        { name: "Ananya Iyer", class: "Class 10", stream: "General", percentage: "99.2%", rank: 1, image: "AI" },
        { name: "Ishaan Gupta", class: "Class 10", stream: "General", percentage: "98.4%", rank: 2, image: "IG" },
    ],
    "2023": [
        { name: "Sneha Patel", class: "Class 12", stream: "Science", percentage: "98.2%", rank: 1, image: "SP" },
        { name: "Aryan Khan", class: "Class 10", stream: "General", percentage: "98.5%", rank: 1, image: "AK" },
    ]
};

const ACADEMIC_ACHIEVEMENTS = {
    "2024": [
        { title: "KVPY Scholarship", student: "Atharva Joshi", detail: "Selected among top 50 in India", icon: GraduationCap },
        { title: "NTSE Stage II", student: "Mira Rajput", detail: "Qualified for national merit", icon: Target },
        { title: "International Maths Olympiad", student: "Varun Reddy", detail: "Gold Medalist (Rank 15 Global)", icon: Award },
    ],
    "2023": [
        { title: "JEE Advanced", student: "5 Students", detail: "Qualified with ranks under 5000", icon: TrendingUp },
    ]
};

const SPORTS_ACHIEVEMENTS = [
    { sport: "Basketball (U-19)", level: "National", position: "Gold", year: "2024", student: "School Team" },
    { sport: "Swimming (100m)", level: "State", position: "Silver", year: "2024", student: "Kabir Singh" },
    { sport: "Athletics", level: "District", position: "Gold", year: "2023", student: "Rohan Mehra" },
    { sport: "Chess", level: "State", position: "Bronze", year: "2024", student: "Sanya Malhotra" },
];

const SCHOOL_AWARDS = [
    { title: "Excellence in E-Learning", organization: "CBSE South Zone", year: "2023", detail: "For innovative digital pedagogy integration." },
    { title: "Swachh Vidyalaya Puraskar", organization: "Ministry of Education", year: "2022", detail: "Five-star rating for cleanliness and hygiene." },
    { title: "Best Sports Infrastructure", organization: "State Education Board", year: "2024", detail: "Recognized for world-class sports facilities." },
];

// --- Sub-components ---

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-accent mb-2">
                {title}
            </h2>
            {subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
            <div className="w-20 h-1 bg-accent mx-auto mt-4 rounded-full" />
        </div>
    );
}

export default function AchievementsPage() {
    const [selectedYear, setSelectedYear] = useState("2024");

    const filteredStats = BOARD_RESULTS[selectedYear as keyof typeof BOARD_RESULTS] || BOARD_RESULTS["2024"];
    const filteredToppers = TOPPERS[selectedYear as keyof typeof TOPPERS] || [];
    const filteredAcademics = ACADEMIC_ACHIEVEMENTS[selectedYear as keyof typeof ACADEMIC_ACHIEVEMENTS] || [];

    return (
        <main className="min-h-screen pb-20">
            {/* Hero Section */}
            <section
                data-hero-dark="true"
                className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden bg-primary text-white"
            >
                <div className="absolute inset-0 opacity-20">
                    <Image
                        src="https://picsum.photos/seed/achievements/1920/1080"
                        alt="Achievements Background"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-primary via-primary/80 to-primary" />
                </div>

                <div className="relative z-10 text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6"
                    >
                        <Trophy className="w-5 h-5 text-accent" />
                        <span className="text-sm font-medium uppercase tracking-wider">Our Success Story</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-extrabold mb-4"
                    >
                        Results & Achievements
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto"
                    >
                        Celebrating academic excellence, sporting spirit, and institutional milestones.
                    </motion.p>
                </div>
            </section>

            {/* Year Filter Bar */}
            <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm py-4">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto gap-4 no-scrollbar">
                    <div className="flex gap-2">
                        {YEARS.map((year) => (
                            <button
                                key={year}
                                onClick={() => setSelectedYear(year)}
                                className={`px-6 py-2 rounded-full transition-all text-sm font-medium whitespace-nowrap ${selectedYear === year
                                    ? "bg-primary text-white shadow-lg"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                Year {year}
                            </button>
                        ))}
                    </div>
                    <div className="hidden lg:flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="text-xs text-gray-500 font-medium">100% Pass Rate</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-accent" />
                            <span className="text-xs text-gray-500 font-medium">National Winners</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-16 space-y-24">

                {/* Quick Stats Section */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { label: "Pass Percentage", value: 100, suffix: "%", icon: Star, color: "text-yellow-500" },
                        { label: "Students Above 90%", value: 42, suffix: "+", icon: TrendingUp, color: "text-green-500" },
                        { label: "Sports Trophies", value: 120, suffix: "+", icon: Trophy, color: "text-accent" },
                        { label: "Years of Excellence", value: 25, suffix: "+", icon: Target, color: "text-blue-500" },
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm text-center group hover:shadow-md transition-all"
                        >
                            <stat.icon className={`w-10 h-10 mx-auto mb-4 ${stat.color} transition-transform group-hover:scale-110`} />
                            <div className="text-3xl font-bold text-primary mb-1">
                                <Counter value={stat.value} suffix={stat.suffix} />
                            </div>
                            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </section>

                {/* CBSE Board Results Section */}
                <section>
                    <SectionTitle
                        title="CBSE Board Results"
                        subtitle={`Academic performance for the year ${selectedYear} showing the success rate and merit highlights.`}
                    />
                    <div className="grid lg:grid-cols-2 gap-10">
                        {filteredStats.map((stat, idx) => (
                            <div key={idx} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-blue-50 rounded-xl">
                                            <Medal className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-primary">{stat.class}</h3>
                                            <p className="text-sm text-gray-500">{stat.studentCount} Students Appeared</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-green-600">{stat.pass}%</div>
                                        <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">Pass Result</p>
                                    </div>
                                </div>

                                {/* CSS Bar Chart */}
                                <div className="space-y-6">
                                    {[
                                        { label: "Above 90% Marks", count: stat.above90, color: "bg-accent" },
                                        { label: "Above 80% Marks", count: stat.above80, color: "bg-blue-500" },
                                        { label: "Passed with Distinction", count: Math.round(stat.studentCount * 0.7), color: "bg-primary" },
                                    ].map((item, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="font-semibold text-gray-700">{item.label}</span>
                                                <span className="font-bold text-primary">{item.count}</span>
                                            </div>
                                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${(item.count / stat.studentCount) * 100}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                                                    className={`h-full ${item.color}`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* School Toppers Section */}
                <section>
                    <SectionTitle
                        title="School Toppers"
                        subtitle="The bright faces that brought laurels to the institution with their exceptional dedication."
                    />
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredToppers.map((topper, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100"
                            >
                                <div className="aspect-4/5 relative overflow-hidden bg-gray-100 flex items-center justify-center text-4xl font-bold text-gray-300">
                                    {topper.image}
                                    <div className="absolute top-4 right-4 z-10">
                                        <div className="bg-accent text-primary p-2 rounded-xl shadow-lg ring-4 ring-white">
                                            <Award className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 text-center">
                                    <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-accent mb-2">
                                        {topper.class} • {topper.stream}
                                    </span>
                                    <h4 className="text-xl font-bold text-primary mb-1">{topper.name}</h4>
                                    <div className="text-2xl font-black text-primary/80">{topper.percentage}</div>
                                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-center gap-1 text-sm font-medium text-gray-500">
                                        Rank {topper.rank} in School
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Academic & Sports Achievements Grid */}
                <div className="grid lg:grid-cols-2 gap-10">
                    {/* Academic Highlights */}
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-accent/20 rounded-2xl">
                                <Target className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary">Academic Excellence</h3>
                        </div>
                        <div className="space-y-4">
                            {filteredAcademics.map((item: any, idx) => (
                                <div key={idx} className="flex gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-accent transition-colors">
                                    <div className="shrink-0 w-12 h-12 bg-blue-50 text-primary flex items-center justify-center rounded-xl">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{item.title}</h4>
                                        <p className="text-sm font-semibold text-accent">{item.student}</p>
                                        <p className="text-sm text-gray-500 mt-1">{item.detail}</p>
                                    </div>
                                </div>
                            ))}
                            {filteredAcademics.length === 0 && (
                                <p className="text-gray-400 italic">No academic highlights recorded for this year.</p>
                            )}
                        </div>
                    </section>

                    {/* Sports Highlights */}
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-green-50 rounded-2xl">
                                <Medal className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary">Sports Achievements</h3>
                        </div>
                        <div className="space-y-4">
                            {SPORTS_ACHIEVEMENTS.slice(0, 4).map((item, idx) => (
                                <div key={idx} className="relative group p-5 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className={`absolute top-0 right-0 w-1 h-full ${item.position === "Gold" ? "bg-yellow-400" :
                                        item.position === "Silver" ? "bg-gray-300" : "bg-orange-400"
                                        }`} />
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-gray-900">{item.sport}</h4>
                                            <p className="text-sm font-medium text-gray-500">{item.level} Level • {item.student}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 font-bold text-primary italic lowercase">
                                                <span className="capitalize">{item.position}</span> Medal
                                            </div>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.year}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* School Awards & Recognitions */}
                <section className="bg-gray-900 rounded-[3rem] p-12 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[100px] rounded-full -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -ml-32 -mb-32" />

                    <div className="relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 italic">Awards & Recognitions</h2>
                            <p className="text-gray-400 max-w-xl mx-auto">Milestones achieved by the institution on its journey towards educational excellence.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {SCHOOL_AWARDS.map((award, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -10 }}
                                    className="p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl"
                                >
                                    <Award className="w-12 h-12 text-accent mb-6 opacity-80" />
                                    <div className="text-xs font-bold text-accent uppercase tracking-widest mb-2">{award.year}</div>
                                    <h4 className="text-xl font-bold mb-3">{award.title}</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed">{award.detail}</p>
                                    <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                                        <span className="text-xs text-gray-500 font-medium">By {award.organization}</span>
                                        <ChevronRight className="w-4 h-4 text-accent" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

            </div>
        </main>
    );
}
