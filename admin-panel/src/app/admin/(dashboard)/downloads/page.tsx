"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    FileText,
    Download,
    Search,
    Calendar,
    Link as LinkIcon,
    ExternalLink,
    FileSearch
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Modal from "@/components/Modal";
import { motion, AnimatePresence } from "framer-motion";
import CloudinaryUpload from "@/components/CloudinaryUpload";

interface Circular {
    _id: string;
    title: string;
    date: string;
    category: string;
    description: string;
    pdfUrl?: string;
    isActive: boolean;
}

const CATEGORIES = ['Circular', 'Date Sheet', 'Syllabus', 'Admission Form', 'Other'];

export default function DownloadsAdminPage() {
    const [items, setItems] = useState<Circular[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        date: new Date().toISOString().split('T')[0],
        category: "Circular",
        description: "",
        pdfUrl: "",
        isActive: true
    });

    useEffect(() => {
        fetchCirculars();
    }, []);

    const fetchCirculars = async () => {
        setIsLoading(true);
        try {
            const schoolId = typeof window !== 'undefined' ? localStorage.getItem("selectedSchool") : null;
            const res = await fetch(`/api/circulars${schoolId ? `?schoolId=${schoolId}` : ""}`);
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (error) {
            toast.error("Failed to fetch downloads");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (item?: Circular) => {
        if (item) {
            setEditingId(item._id);
            setFormData({
                title: item.title,
                date: new Date(item.date).toISOString().split('T')[0],
                category: item.category,
                description: item.description,
                pdfUrl: item.pdfUrl || "",
                isActive: item.isActive
            });
        } else {
            setEditingId(null);
            setFormData({
                title: "",
                date: new Date().toISOString().split('T')[0],
                category: "Circular",
                description: "",
                pdfUrl: "",
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const method = editingId ? "PUT" : "POST";
            const url = editingId ? `/api/circulars/${editingId}` : "/api/circulars";

            const schoolId = typeof window !== 'undefined' ? localStorage.getItem("selectedSchool") : null;
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    ...(schoolId && { "x-school-id": schoolId })
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success(`Download ${editingId ? "updated" : "added"} successfully`);
                fetchCirculars();
                setIsModalOpen(false);
            } else {
                toast.error("Failed to save download");
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
            const schoolId = typeof window !== 'undefined' ? localStorage.getItem("selectedSchool") : null;
            const res = await fetch(`/api/circulars/${id}`, {
                method: "DELETE",
                headers: {
                    ...(schoolId && { "x-school-id": schoolId })
                }
            });
            if (res.ok) {
                toast.success("Deleted successfully");
                fetchCirculars();
            } else {
                toast.error("Failed to delete");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black font-playfair bg-linear-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">Notice Board</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium italic">Manage circulars, notices, and academic resources</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl hover:bg-primary/90 transition-all font-bold shadow-xl shadow-primary/20 hover:-translate-y-1"
                >
                    <Plus className="w-5 h-5" />
                    New Notice
                </button>
            </div>

            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search by title or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-6 py-5 focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm text-lg font-medium"
                />
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array(4).fill(null).map((_, i) => (
                        <div key={i} className="bg-white rounded-5xl p-8 border border-slate-50 h-32 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredItems.map((item, index) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="group bg-white rounded-5xl p-8 border border-slate-50 shadow-sm hover:shadow-2xl transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleOpenModal(item)} className="p-2 text-slate-400 hover:text-primary transition-colors">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(item._id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg">
                                            {item.category}
                                        </span>
                                        <span className={cn(
                                            "px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-md",
                                            item.isActive ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"
                                        )}>
                                            {item.isActive ? "Active" : "Inactive"}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-auto">
                                            {new Date(item.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-serif font-black text-slate-900 mb-2 truncate group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 line-clamp-2 mb-6">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-slate-50">
                                    {item.pdfUrl ? (
                                        <a
                                            href={item.pdfUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-primary font-bold text-xs hover:underline"
                                        >
                                            <Download className="w-4 h-4" />
                                            View Attachment
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    ) : (
                                        <span className="text-slate-300 text-xs italic">No attachment</span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? "Edit Notice" : "Create New Notice"}
            >
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Title</label>
                            <input
                                required
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                                placeholder="e.g. Annual Syllabus 2024-25"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-bold h-[58px]"
                                >
                                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Date</label>
                                <input
                                    required
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-bold h-[58px]"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm"
                                rows={3}
                                placeholder="Provide brief details about this download..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Direct File Upload</label>
                            <CloudinaryUpload
                                value={formData.pdfUrl}
                                onChange={(url) => setFormData({ ...formData, pdfUrl: url })}
                                onRemove={() => setFormData({ ...formData, pdfUrl: "" })}
                                folder="circulars"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">File URL / Attachment (Manual Override)</label>
                            <input
                                type="text"
                                value={formData.pdfUrl}
                                onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                                className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-mono text-xs text-slate-500"
                                placeholder="Paste Google Drive/Cloudinary link if not using direct upload"
                            />
                        </div>

                        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-5 h-5 rounded-lg border-slate-300 text-primary focus:ring-primary transition-all"
                            />
                            <label htmlFor="isActive" className="text-sm font-bold text-slate-700 cursor-pointer">
                                Active (Show on Website Notice Board)
                            </label>
                        </div>

                    </div>

                    <div className="flex gap-4 pt-6 border-t border-slate-100">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-white border border-slate-200 text-slate-500 font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-slate-50 transition-all">Discard</button>
                        <button type="submit" disabled={isSaving} className="flex-2 bg-primary text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">{isSaving ? "Saving..." : (editingId ? "Update Notice" : "Publish Notice")}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
