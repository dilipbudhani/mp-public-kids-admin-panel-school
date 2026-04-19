import React from "react";
export const dynamic = "force-dynamic";
import { dbConnect } from "@/lib/mongodb";
import News from "@/models/News";
import HeroSlide from "@/models/HeroSlide";
import Faculty from "@/models/Faculty";
import Gallery from "@/models/Gallery";
import {
    Users,
    Image as ImageIcon,
    Newspaper,
    GraduationCap,
    ArrowUpRight,
    TrendingUp
} from "lucide-react";

export default async function AdminDashboard() {
    await dbConnect();

    // Fetch some stats
    const [newsCount, slidesCount, facultyCount, galleryCount] = await Promise.all([
        News.countDocuments(),
        HeroSlide.countDocuments(),
        Faculty.countDocuments(),
        Gallery.countDocuments(),
    ]);

    const stats = [
        { label: "Active News/Events", value: newsCount, icon: Newspaper, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "Hero Slides", value: slidesCount, icon: ImageIcon, color: "text-purple-500", bg: "bg-purple-50" },
        { label: "Faculty Members", value: facultyCount, icon: GraduationCap, color: "text-emerald-500", bg: "bg-emerald-50" },
        { label: "Gallery Media", value: galleryCount, icon: ImageIcon, color: "text-amber-500", bg: "bg-amber-50" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 font-playfair">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Welcome back to the MP Kids School management panel.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl transition-colors`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                <TrendingUp className="w-3 h-3" />
                                Live
                            </span>
                        </div>
                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                            <p className="text-xs text-gray-400">total records</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quick Actions */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="font-bold text-lg text-gray-900">Quick Actions</h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary hover:bg-primary/5 transition-all text-left">
                            <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-primary/10">
                                <Newspaper className="w-5 h-5 text-gray-500 group-hover:text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">Post New Date</p>
                                <p className="text-xs text-gray-500">Add latest school updates</p>
                            </div>
                        </button>
                        <button className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary hover:bg-primary/5 transition-all text-left">
                            <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-primary/10">
                                <ImageIcon className="w-5 h-5 text-gray-500 group-hover:text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">Update Carousel</p>
                                <p className="text-xs text-gray-500">Change homepage banners</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* System Info */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">System Status</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-gray-50">
                            <span className="text-sm text-gray-500">Database Engine</span>
                            <span className="text-sm font-medium text-gray-900">MongoDB Atlas (Mongoose)</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-50">
                            <span className="text-sm text-gray-500">Environment</span>
                            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                                {process.env.NODE_ENV === "production" ? "Production" : "Development"}
                            </span>
                        </div>
                        <div className="relative pt-4">
                            <p className="text-xs text-gray-500 mb-2 italic">Database fully migrated to MongoDB Atlas for production scalability and flexibility.</p>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-primary w-full h-full rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
