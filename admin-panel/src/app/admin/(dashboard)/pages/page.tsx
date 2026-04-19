"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    FileText,
    Search,
    ExternalLink,
    ChevronRight,
    Layout
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Modal from "@/components/Modal";

interface PageListing {
    _id: string;
    title: string;
    slug: string;
    updatedAt: string;
}

export default function StaticPagesListPage() {
    const [pages, setPages] = useState<PageListing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newPage, setNewPage] = useState({ title: "", slug: "" });

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/static-pages");
            if (res.ok) {
                const data = await res.json();
                setPages(data);
            }
        } catch (error) {
            toast.error("Failed to fetch pages");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreatePage = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/static-pages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPage),
            });

            if (res.ok) {
                const created = await res.json();
                toast.success("Page created successfully");
                setIsCreateModalOpen(false);
                // Redirect to editor
                window.location.href = `/admin/pages/${created.slug}`;
            } else {
                const err = await res.json();
                toast.error(err.message || "Failed to create page");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const handleDelete = async (slug: string) => {
        if (!confirm("Are you sure? This will delete the page and all its sections.")) return;

        try {
            const res = await fetch(`/api/static-pages/${slug}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Page deleted");
                fetchPages();
            } else {
                toast.error("Failed to delete page");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const filteredPages = pages.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black font-playfair bg-linear-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">Static Content</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium italic">Manage About, Academics, and Facility information pages</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl hover:bg-primary/90 transition-all font-bold shadow-xl shadow-primary/20 hover:-translate-y-1"
                >
                    <Plus className="w-5 h-5" />
                    Create New Page
                </button>
            </div>

            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search pages by title or slug..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-6 py-5 focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm text-lg font-medium"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    Array(6).fill(null).map((_, i) => (
                        <div key={i} className="bg-white rounded-4xl p-8 border border-slate-50 space-y-4 animate-pulse">
                            <div className="h-6 bg-slate-100 rounded-full w-3/4" />
                            <div className="h-4 bg-slate-50 rounded-full w-1/2" />
                            <div className="pt-4 flex gap-2">
                                <div className="h-10 grow bg-slate-50 rounded-xl" />
                                <div className="h-10 w-10 bg-slate-50 rounded-xl" />
                            </div>
                        </div>
                    ))
                ) : filteredPages.map((page) => (
                    <div
                        key={page._id}
                        className="group bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Layout className="w-24 h-24" />
                        </div>

                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                                <FileText className="w-6 h-6" />
                            </div>

                            <h3 className="text-2xl font-serif font-black text-slate-900 mb-2 truncate group-hover:text-primary transition-colors">
                                {page.title}
                            </h3>
                            <p className="text-xs font-mono text-slate-400 mb-6 flex items-center gap-1.5 uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                /{page.slug}
                            </p>

                            <div className="flex gap-3">
                                <Link
                                    href={`/admin/pages/${page.slug}`}
                                    className="flex-1 bg-slate-50 text-slate-900 px-4 py-3 rounded-xl hover:bg-primary hover:text-white transition-all font-bold text-sm text-center flex items-center justify-center gap-2 group/btn"
                                >
                                    <Pencil className="w-4 h-4" />
                                    Edit Content
                                    <ChevronRight className="w-4 h-4 translate-x-0 group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                                <button
                                    onClick={() => handleDelete(page.slug)}
                                    className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm hover:shadow-red-200"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Page"
            >
                <form onSubmit={handleCreatePage} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Page Title</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Our Mission & Vision"
                                value={newPage.title}
                                onChange={(e) => {
                                    const title = e.target.value;
                                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                                    setNewPage({ title, slug });
                                }}
                                className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-bold text-lg"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">URL Slug</label>
                            <div className="relative">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm group-focus-within:text-primary transition-colors">/</div>
                                <input
                                    required
                                    type="text"
                                    placeholder="our-mission-vision"
                                    value={newPage.slug}
                                    onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                                    className="w-full bg-slate-50 border-slate-100 rounded-2xl pl-10 pr-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-mono font-bold text-slate-600"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(false)}
                            className="flex-1 bg-white border border-slate-200 text-slate-500 font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-2 bg-primary text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all"
                        >
                            Initialize Page
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
