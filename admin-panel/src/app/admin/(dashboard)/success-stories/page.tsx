"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Trophy,
    GraduationCap,
    Search,
    CheckCircle2,
    XCircle,
    BookOpen,
    Quote,
    Star
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Modal from "@/components/Modal";
import { motion, AnimatePresence } from "framer-motion";

interface SuccessStory {
    _id: string;
    name: string;
    batch: string;
    category: string;
    headline: string;
    summary: string;
    story: string;
    initials: string;
    color: string;
    isActive: boolean;
    displayOrder: number;
}

const CATEGORIES = ['Academics', 'Sports', 'Arts', 'Innovation', 'Leadership'];
const PRESET_COLORS = [
    '#3B82F6', // Blue
    '#8B5CF6', // Violet
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EC4899', // Pink
    '#EF4444', // Red
    '#0EA5E9', // Sky
    '#14B8A6', // Teal
];

export default function SuccessStoriesAdminPage() {
    const [items, setItems] = useState<SuccessStory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        batch: "",
        category: "Academics",
        headline: "",
        summary: "",
        story: "",
        initials: "",
        color: PRESET_COLORS[0],
        isActive: true,
        displayOrder: 0
    });

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        setIsLoading(true);
        try {
            const schoolId = localStorage.getItem("selectedSchool") || "mp-kids-school";
            const res = await fetch(`/api/success-stories?schoolId=${schoolId}`);
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (error) {
            toast.error("Failed to fetch success stories");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (item?: SuccessStory) => {
        if (item) {
            setEditingId(item._id);
            setFormData({
                name: item.name,
                batch: item.batch,
                category: item.category,
                headline: item.headline,
                summary: item.summary,
                story: item.story,
                initials: item.initials,
                color: item.color,
                isActive: item.isActive,
                displayOrder: item.displayOrder
            });
        } else {
            setEditingId(null);
            setFormData({
                name: "",
                batch: "",
                category: "Academics",
                headline: "",
                summary: "",
                story: "",
                initials: "",
                color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)],
                isActive: true,
                displayOrder: items.length
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const method = editingId ? "PUT" : "POST";
            const url = editingId ? `/api/success-stories/${editingId}` : "/api/success-stories";

            const schoolId = localStorage.getItem("selectedSchool") || "mp-kids-school";
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "x-school-id": schoolId
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success(`Success story ${editingId ? "updated" : "added"} successfully`);
                fetchStories();
                setIsModalOpen(false);
            } else {
                toast.error("Failed to save story");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this success story?")) return;

        try {
            const res = await fetch(`/api/success-stories/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Success story deleted");
                fetchStories();
            } else {
                toast.error("Failed to delete story");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const toggleStatus = async (item: SuccessStory) => {
        try {
            const schoolId = localStorage.getItem("selectedSchool") || "mp-kids-school";
            const res = await fetch(`/api/success-stories/${item._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-school-id": schoolId
                },
                body: JSON.stringify({ ...item, isActive: !item.isActive }),
            });

            if (res.ok) {
                toast.success("Status updated");
                fetchStories();
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-playfair">Success Stories</h1>
                    <p className="text-gray-500">Manage student achievements and inspirational journeys</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20 self-start"
                >
                    <Plus className="w-5 h-5" />
                    New Story
                </button>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search stories by name, headline, category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary transition-all text-sm"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map(i => (
                        <div key={i} className="bg-white rounded-3xl h-64 animate-pulse border border-gray-100" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredItems.map((item, index) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                className={cn(
                                    "bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden flex flex-col sm:flex-row gap-6",
                                    !item.isActive && "opacity-75 grayscale-[0.5]"
                                )}
                            >
                                <div className="absolute top-4 right-4 z-10">
                                    <button
                                        onClick={() => toggleStatus(item)}
                                        className={cn(
                                            "p-2 rounded-full transition-all",
                                            item.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                                        )}
                                    >
                                        {item.isActive ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                    </button>
                                </div>

                                <div className="sm:w-32 flex flex-col items-center text-center space-y-3 shrink-0">
                                    <div
                                        className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                                        style={{ backgroundColor: item.color }}
                                    >
                                        {item.initials}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs font-bold text-primary uppercase">{item.category}</div>
                                        <div className="text-sm font-medium text-gray-500">{item.batch}</div>
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0 space-y-3">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-xl leading-tight">{item.headline}</h3>
                                        <p className="text-sm text-gray-500 font-medium">By {item.name}</p>
                                    </div>

                                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                                        {item.summary}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                        <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold uppercase tracking-wider">
                                            <BookOpen className="w-4 h-4" />
                                            Full Story Available
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleOpenModal(item)}
                                                className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-all"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? "Edit Story" : "Add Success Story"}
            >
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Name</label>
                            <input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
                                placeholder="Student or Alumni name"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Initials</label>
                            <input
                                required
                                maxLength={2}
                                value={formData.initials}
                                onChange={(e) => setFormData({ ...formData, initials: e.target.value.toUpperCase() })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
                                placeholder="e.g. MS"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Batch / Year</label>
                            <input
                                required
                                value={formData.batch}
                                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
                                placeholder="e.g. Class of 2023"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Headline</label>
                            <input
                                required
                                value={formData.headline}
                                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all font-bold"
                                placeholder="e.g. Cracking IIT with AIR 500"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Summary</label>
                            <textarea
                                required
                                rows={2}
                                value={formData.summary}
                                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
                                placeholder="A short 2-3 line summary of the achievement..."
                            />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Story</label>
                            <textarea
                                required
                                rows={6}
                                value={formData.story}
                                onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
                                placeholder="Detailed story and journey..."
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avatar Color</label>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {PRESET_COLORS.map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, color: c })}
                                        className={cn(
                                            "w-8 h-8 rounded-lg transition-all",
                                            formData.color === c ? "ring-2 ring-offset-2 ring-primary scale-110 shadow-md" : ""
                                        )}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Display Order</label>
                            <input
                                type="number"
                                value={formData.displayOrder}
                                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <label htmlFor="isActive" className="text-sm font-bold text-gray-500 uppercase tracking-wider cursor-pointer">Published</label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all font-bold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="bg-primary text-white px-10 py-3 rounded-xl hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                            {isSaving ? "Saving..." : "Save Story"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
