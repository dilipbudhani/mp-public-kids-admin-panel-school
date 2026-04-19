"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Trophy,
    BarChart3,
    Search,
    User
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Modal from "@/components/Modal";
import CloudinaryUpload from "@/components/CloudinaryUpload";
import { motion, AnimatePresence } from "framer-motion";

interface Achievement {
    _id: string;
    studentName: string;
    class: string;
    year: string;
    marks: string;
    position?: string;
    image?: string;
    category: string;
    displayOrder: number;
    isActive: boolean;
}

interface Stat {
    _id: string;
    label: string;
    value: number;
    suffix: string;
    icon: string;
    displayOrder: number;
    isActive: boolean;
}

const CATEGORIES = ['Class X', 'Class XII', 'Sports', 'Other'];

export default function ResultsAdminPage() {
    const [activeTab, setActiveTab] = useState<'achievements' | 'stats'>('achievements');
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [stats, setStats] = useState<Stat[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [achievementForm, setAchievementForm] = useState({
        studentName: "",
        class: "",
        year: new Date().getFullYear().toString(),
        marks: "",
        position: "",
        image: "",
        category: "Class X",
        displayOrder: 0,
        isActive: true
    });

    const [statForm, setStatForm] = useState({
        label: "",
        value: 0,
        suffix: "+",
        icon: "Star",
        displayOrder: 0,
        isActive: true
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [achRes, statRes] = await Promise.all([
                fetch("/api/achievements"),
                fetch("/api/stats")
            ]);

            if (achRes.ok) setAchievements(await achRes.json());
            if (statRes.ok) setStats(await statRes.json());
        } catch (error) {
            toast.error("Failed to fetch data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (item?: Achievement | Stat) => {
        if (activeTab === 'achievements') {
            if (item) {
                const achievement = item as Achievement;
                setEditingId(achievement._id);
                setAchievementForm({
                    studentName: achievement.studentName,
                    class: achievement.class,
                    year: achievement.year,
                    marks: achievement.marks,
                    position: achievement.position || "",
                    image: achievement.image || "",
                    category: achievement.category,
                    displayOrder: achievement.displayOrder,
                    isActive: achievement.isActive
                });
            } else {
                setEditingId(null);
                setAchievementForm({
                    studentName: "",
                    class: "",
                    year: new Date().getFullYear().toString(),
                    marks: "",
                    position: "",
                    image: "",
                    category: "Class X",
                    displayOrder: achievements.length,
                    isActive: true
                });
            }
        } else {
            if (item) {
                const stat = item as Stat;
                setEditingId(stat._id);
                setStatForm({
                    label: stat.label,
                    value: stat.value,
                    suffix: stat.suffix || "+",
                    icon: stat.icon || "Star",
                    displayOrder: stat.displayOrder,
                    isActive: stat.isActive
                });
            } else {
                setEditingId(null);
                setStatForm({
                    label: "",
                    value: 0,
                    suffix: "+",
                    icon: "Star",
                    displayOrder: stats.length,
                    isActive: true
                });
            }
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const method = editingId ? "PUT" : "POST";
            const endpoint = activeTab === 'achievements' ? 'achievements' : 'stats';
            const url = editingId ? `/api/${endpoint}/${editingId}` : `/api/${endpoint}`;
            const body = activeTab === 'achievements' ? achievementForm : statForm;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                toast.success(`${activeTab === 'achievements' ? 'Achievement' : 'Stat'} saved successfully`);
                fetchData();
                setIsModalOpen(false);
            } else {
                toast.error("Failed to save data");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            const endpoint = activeTab === 'achievements' ? 'achievements' : 'stats';
            const res = await fetch(`/api/${endpoint}/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Deleted successfully");
                fetchData();
            } else {
                toast.error("Failed to delete");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const filteredAchievements = achievements.filter(item =>
        item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.year.includes(searchTerm)
    );

    const filteredStats = stats.filter(item =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black font-playfair bg-linear-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">Results & Achievements</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium italic">Manage board toppers and school-wide performance statistics</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl hover:bg-primary/90 transition-all font-bold shadow-xl shadow-primary/20 hover:-translate-y-1"
                >
                    <Plus className="w-5 h-5" />
                    {activeTab === 'achievements' ? 'Add Topper' : 'Add Stat'}
                </button>
            </div>

            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('achievements')}
                    className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-bold text-sm",
                        activeTab === 'achievements' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    <Trophy className="w-4 h-4" />
                    Board Toppers
                </button>
                <button
                    onClick={() => setActiveTab('stats')}
                    className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-bold text-sm",
                        activeTab === 'stats' ? "bg-white text-secondary shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    <BarChart3 className="w-4 h-4" />
                    School Highlights
                </button>
            </div>

            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                <input
                    type="text"
                    placeholder={`Search ${activeTab === 'achievements' ? 'toppers by name or year' : 'stats by label'}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-6 py-5 focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm text-lg font-medium"
                />
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array(3).fill(null).map((_, i) => (
                        <div key={i} className="bg-white rounded-5xl p-8 border border-slate-50 h-64 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {activeTab === 'achievements' ? (
                            filteredAchievements.map((item, index) => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group bg-white rounded-5xl p-8 border border-slate-50 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden"
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="relative w-24 h-24 rounded-3xl overflow-hidden bg-slate-100 ring-4 ring-slate-50 group-hover:ring-primary/10 transition-all">
                                            {item.image ? (
                                                <img src={item.image} alt={item.studentName} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <User className="w-10 h-10" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleOpenModal(item)} className="p-3 bg-slate-50 text-slate-400 hover:bg-primary hover:text-white rounded-xl transition-all">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(item._id)} className="p-3 bg-red-50 text-red-300 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg">
                                                    {item.category}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {item.year}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-serif font-black text-slate-900">{item.studentName}</h3>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-slate-50 rounded-2xl p-4">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Score</p>
                                                <p className="text-lg font-black text-primary">{item.marks}</p>
                                            </div>
                                            <div className="bg-slate-50 rounded-2xl p-4">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Position</p>
                                                <p className="text-lg font-black text-slate-700">{item.position || "-"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            filteredStats.map((item, index) => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group bg-white rounded-5xl p-8 border border-slate-50 shadow-sm hover:shadow-2xl transition-all"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-16 h-16 bg-secondary/5 rounded-2xl flex items-center justify-center text-secondary">
                                            <BarChart3 className="w-8 h-8" />
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleOpenModal(item)} className="p-3 bg-slate-50 text-slate-400 hover:bg-secondary hover:text-white rounded-xl transition-all">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(item._id)} className="p-3 bg-red-50 text-red-300 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-black text-slate-900">{item.value}</span>
                                            <span className="text-xl font-black text-secondary">{item.suffix}</span>
                                        </div>
                                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">{item.label}</p>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? (activeTab === 'achievements' ? "Edit Topper" : "Edit Stat") : (activeTab === 'achievements' ? "Add New Topper" : "Add New Stat")}
            >
                {activeTab === 'achievements' ? (
                    <form onSubmit={handleSave} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Student Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={achievementForm.studentName}
                                        onChange={(e) => setAchievementForm({ ...achievementForm, studentName: e.target.value })}
                                        className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                                        placeholder="e.g. Rahul Verma"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                                        <select
                                            value={achievementForm.category}
                                            onChange={(e) => setAchievementForm({ ...achievementForm, category: e.target.value })}
                                            className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-bold h-[58px]"
                                        >
                                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Year</label>
                                        <input
                                            required
                                            type="text"
                                            value={achievementForm.year}
                                            onChange={(e) => setAchievementForm({ ...achievementForm, year: e.target.value })}
                                            className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-bold h-[58px]"
                                            placeholder="2024"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Marks (%)</label>
                                        <input
                                            required
                                            type="text"
                                            value={achievementForm.marks}
                                            onChange={(e) => setAchievementForm({ ...achievementForm, marks: e.target.value })}
                                            className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-bold h-[58px]"
                                            placeholder="98.5%"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Class</label>
                                        <input
                                            required
                                            type="text"
                                            value={achievementForm.class}
                                            onChange={(e) => setAchievementForm({ ...achievementForm, class: e.target.value })}
                                            className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-bold h-[58px]"
                                            placeholder="12th (Science)"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Student Photo</label>
                                    <CloudinaryUpload
                                        value={achievementForm.image}
                                        onChange={(url) => setAchievementForm({ ...achievementForm, image: url })}
                                        onRemove={() => setAchievementForm({ ...achievementForm, image: "" })}
                                        folder="achievements"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Position / Merit</label>
                                    <input
                                        type="text"
                                        value={achievementForm.position}
                                        onChange={(e) => setAchievementForm({ ...achievementForm, position: e.target.value })}
                                        className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-bold h-[58px]"
                                        placeholder="District Topper / 1st Rank"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-white border border-slate-200 text-slate-500 font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-slate-50 transition-all">Discard</button>
                            <button type="submit" disabled={isSaving} className="flex-2 bg-primary text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">{isSaving ? "Saving..." : (editingId ? "Update Topper" : "Add Topper")}</button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleSave} className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Label</label>
                                <input
                                    required
                                    type="text"
                                    value={statForm.label}
                                    onChange={(e) => setStatForm({ ...statForm, label: e.target.value })}
                                    className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-secondary/10 transition-all font-bold"
                                    placeholder="e.g. Students Reached"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Value (Numeric)</label>
                                    <input
                                        required
                                        type="number"
                                        value={statForm.value}
                                        onChange={(e) => setStatForm({ ...statForm, value: parseInt(e.target.value) })}
                                        className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-secondary/10 transition-all font-bold h-[58px]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Suffix</label>
                                    <input
                                        type="text"
                                        value={statForm.suffix}
                                        onChange={(e) => setStatForm({ ...statForm, suffix: e.target.value })}
                                        className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-secondary/10 transition-all font-bold h-[58px]"
                                        placeholder="+"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Icon Type</label>
                                    <select
                                        value={statForm.icon}
                                        onChange={(e) => setStatForm({ ...statForm, icon: e.target.value })}
                                        className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-secondary/10 transition-all font-bold h-[58px]"
                                    >
                                        <option value="Trophy">Trophy</option>
                                        <option value="Star">Star</option>
                                        <option value="TrendingUp">Trending Up</option>
                                        <option value="BarChart">Bar Chart</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-white border border-slate-200 text-slate-500 font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-slate-50 transition-all">Discard</button>
                            <button type="submit" disabled={isSaving} className="flex-2 bg-secondary text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-secondary/20 hover:-translate-y-1 transition-all">{isSaving ? "Saving..." : (editingId ? "Update Stat" : "Add Stat")}</button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
}
