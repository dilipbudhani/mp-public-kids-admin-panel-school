"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Newspaper,
    Search,
    Calendar,
    Tag,
    Clock,
    CheckCircle2,
    X
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Modal from "@/components/Modal";
import CloudinaryUpload from "@/components/CloudinaryUpload";

interface NewsItem {
    _id: string;
    title: string;
    slug: string;
    content: string;
    summary?: string;
    imageUrl?: string;
    category: string;
    date: string;
    showPopup: boolean;
}

const CATEGORIES = ['Academics', 'Sports', 'Events', 'Achievements', 'Notice', 'Others'];

export default function NewsAdminPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        summary: "",
        imageUrl: "",
        category: "Others",
        date: new Date().toISOString().split('T')[0],
        showPopup: false
    });

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/news");
            if (res.ok) {
                const data = await res.json();
                setNews(data);
            }
        } catch (error) {
            toast.error("Failed to fetch news");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (item?: NewsItem) => {
        if (item) {
            setEditingId(item._id);
            setFormData({
                title: item.title,
                slug: item.slug,
                content: item.content,
                summary: item.summary || "",
                imageUrl: item.imageUrl || "",
                category: item.category,
                date: new Date(item.date).toISOString().split('T')[0],
                showPopup: item.showPopup || false
            });
        } else {
            setEditingId(null);
            setFormData({
                title: "",
                slug: "",
                content: "",
                summary: "",
                imageUrl: "",
                category: "Others",
                date: new Date().toISOString().split('T')[0],
                showPopup: false
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const method = editingId ? "PUT" : "POST";
            const url = editingId ? `/api/news/${editingId}` : "/api/news";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success(`News ${editingId ? "updated" : "added"} successfully`);
                fetchNews();
                setIsModalOpen(false);
            } else {
                const err = await res.json();
                toast.error(err.message || "Failed to save news");
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
            const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("News deleted");
                fetchNews();
            } else {
                toast.error("Failed to delete news");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const filteredNews = news.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black font-playfair bg-linear-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">News & Stories</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium italic">Broadcast school achievements and important updates</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl hover:bg-primary/90 transition-all font-bold shadow-xl shadow-primary/20 hover:-translate-y-1"
                >
                    <Plus className="w-5 h-5" />
                    Create News Story
                </button>
            </div>

            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search news by title or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-6 py-5 focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm text-lg font-medium"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                    Array(4).fill(null).map((_, i) => (
                        <div key={i} className="bg-white rounded-5xl p-8 border border-slate-50 space-y-4 animate-pulse h-[200px]" />
                    ))
                ) : filteredNews.map((item) => (
                    <div
                        key={item._id}
                        className="group bg-white rounded-5xl p-8 border border-slate-50 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col md:flex-row gap-8"
                    >
                        <div className="relative w-full md:w-40 h-40 shrink-0 rounded-4xl overflow-hidden bg-slate-100">
                            {item.imageUrl ? (
                                <img src={item.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <Newspaper className="w-10 h-10" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 flex flex-col">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg">
                                    {item.category}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Clock className="w-3 h-3" />
                                    {new Date(item.date).toLocaleDateString()}
                                </span>
                            </div>

                            <h3 className="text-xl font-serif font-black text-slate-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                {item.title}
                            </h3>
                            <p className="text-sm text-slate-500 line-clamp-2 mb-6 leading-relaxed">
                                {item.summary || "No description available."}
                            </p>

                            <div className="mt-auto flex gap-3">
                                <button
                                    onClick={() => handleOpenModal(item)}
                                    className="flex-1 bg-slate-50 text-slate-900 px-4 py-3 rounded-xl hover:bg-primary hover:text-white transition-all font-bold text-xs flex items-center justify-center gap-2"
                                >
                                    <Pencil className="w-4 h-4" />
                                    Edit Story
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="p-3 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? "Edit News Story" : "Publish New Story"}
            >
                <form onSubmit={handleSave} className="space-y-8">
                    <div className="space-y-2 pb-4 border-b border-slate-100">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Story Title</label>
                        <input
                            required
                            type="text"
                            placeholder="Enter a catchy title for your story..."
                            value={formData.title}
                            onChange={(e) => {
                                const title = e.target.value;
                                const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                                setFormData({ ...formData, title, slug });
                            }}
                            className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-primary/10 transition-all font-bold text-xl text-slate-900 placeholder:text-slate-300"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
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
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Publish Date</label>
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
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Excerpt (Short Summary)</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.summary}
                                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                    className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm"
                                    placeholder="Brief summary of the news story..."
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Cover Image</label>
                                <CloudinaryUpload
                                    value={formData.imageUrl}
                                    onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                                    onRemove={() => setFormData({ ...formData, imageUrl: "" })}
                                    folder="news"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">URL Slug</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-mono text-xs font-bold text-slate-400"
                                />
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <input
                                    type="checkbox"
                                    id="showPopup"
                                    checked={formData.showPopup}
                                    onChange={(e) => setFormData({ ...formData, showPopup: e.target.checked })}
                                    className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor="showPopup" className="text-sm font-bold text-slate-700 cursor-pointer select-none">
                                    Show as Website Popup Notice
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Story (Article Body)</label>
                        <textarea
                            required
                            rows={10}
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full bg-slate-50 border-slate-100 rounded-3xl px-8 py-6 focus:ring-4 focus:ring-primary/10 transition-all font-medium leading-relaxed"
                            placeholder="Write your article here..."
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 bg-white border border-slate-200 text-slate-500 font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-slate-50 transition-all"
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-2 bg-primary text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                        >
                            {isSaving ? "Publishing..." : (editingId ? "Update Story" : "Publish to Site")}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
