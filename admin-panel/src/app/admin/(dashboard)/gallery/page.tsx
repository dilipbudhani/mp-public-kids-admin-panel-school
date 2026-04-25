"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Image as ImageIcon,
    Search,
    Filter,
    Video,
    Calendar,
    ExternalLink,
    Play,
    X
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Modal from "@/components/Modal";
import CloudinaryUpload from "@/components/CloudinaryUpload";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface GalleryItem {
    _id: string;
    title: string;
    imageUrl: string;
    publicId: string;
    type: 'image' | 'video';
    thumbnailUrl?: string;
    category: string;
    date: string;
}

const CATEGORIES = ['Sports', 'Events', 'Academics', 'Campus', 'Others'];

export default function GalleryAdminPage() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);

    // Bulk upload states
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [bulkItems, setBulkItems] = useState<{ imageUrl: string; publicId: string }[]>([]);
    const [bulkFormData, setBulkFormData] = useState({
        category: "Others",
        date: new Date().toISOString().split('T')[0],
        type: "image" as "image" | "video"
    });

    const [formData, setFormData] = useState({
        title: "",
        type: "image" as "image" | "video",
        imageUrl: "",
        publicId: "manual",
        thumbnailUrl: "",
        category: "Others",
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        setIsLoading(true);
        try {
            const schoolId = (typeof window !== 'undefined' ? localStorage.getItem("selectedSchool") : null) || "mp-kids-school";
            const res = await fetch(`/api/gallery${schoolId ? `?schoolId=${schoolId}` : ""}`);
            if (res.ok) {
                const data = await res.json();
                // Ensure the data is an array before setting it
                setItems(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            toast.error("Failed to fetch gallery");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (item?: GalleryItem) => {
        if (item) {
            setEditingId(item._id);
            setFormData({
                title: item.title,
                type: item.type,
                imageUrl: item.imageUrl,
                publicId: item.publicId,
                thumbnailUrl: item.thumbnailUrl || "",
                category: item.category,
                date: item.date ? new Date(item.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
            });
        } else {
            setEditingId(null);
            setFormData({
                title: "",
                type: "image",
                imageUrl: "",
                publicId: "manual",
                thumbnailUrl: "",
                category: "Others",
                date: new Date().toISOString().split('T')[0]
            });
        }
        setIsModalOpen(true);
    };

    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const dataToSave = { ...formData };

        // Auto-generate thumbnail for YouTube if video
        if (dataToSave.type === 'video' && dataToSave.imageUrl.includes('youtube.com') || dataToSave.imageUrl.includes('youtu.be')) {
            const videoId = getYouTubeId(dataToSave.imageUrl);
            if (videoId) {
                dataToSave.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                dataToSave.publicId = videoId; // Use videoId as publicId for videos
            }
        }

        try {
            const method = editingId ? "PUT" : "POST";
            const url = editingId ? `/api/gallery/${editingId}` : "/api/gallery";

            const schoolId = (typeof window !== 'undefined' ? localStorage.getItem("selectedSchool") : null) || "mp-kids-school";
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    ...(schoolId && { "x-school-id": schoolId })
                },
                body: JSON.stringify(dataToSave),
            });

            if (res.ok) {
                toast.success(`Item ${editingId ? "updated" : "added"} successfully`);
                fetchGallery();
                setIsModalOpen(false);
            } else {
                const error = await res.json();
                toast.error(error.message || "Failed to save item");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    const handleBulkSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (bulkItems.length === 0) {
            toast.error("Please upload at least one file");
            return;
        }
        setIsSaving(true);
        const schoolId = (typeof window !== 'undefined' ? localStorage.getItem("selectedSchool") : null) || "mp-kids-school";
        let successCount = 0;
        let failCount = 0;

        await Promise.allSettled(bulkItems.map((item, idx) => {
            const isVideo = bulkFormData.type === 'video';
            const thumbUrl = isVideo && item.imageUrl ? item.imageUrl.replace(/\.[^/.]+$/, ".jpg") : "";

            const dataToSave = {
                title: `${bulkFormData.category} Upload ${idx + 1}`,
                type: bulkFormData.type,
                imageUrl: item.imageUrl,
                publicId: item.publicId,
                thumbnailUrl: thumbUrl,
                category: bulkFormData.category,
                date: bulkFormData.date,
            };
            return fetch("/api/gallery", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(schoolId && { "x-school-id": schoolId })
                },
                body: JSON.stringify(dataToSave),
            }).then(res => {
                if (res.ok) successCount++;
                else failCount++;
            });
        }));

        if (successCount > 0) toast.success(`Added ${successCount} items successfully`);
        if (failCount > 0) toast.error(`Failed to add ${failCount} items`);

        setIsSaving(false);
        setBulkItems([]);
        setIsBulkModalOpen(false);
        fetchGallery();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            const schoolId = typeof window !== 'undefined' ? localStorage.getItem("selectedSchool") : null;
            const res = await fetch(`/api/gallery/${id}`, {
                method: "DELETE",
                headers: {
                    ...(schoolId && { "x-school-id": schoolId })
                }
            });

            if (res.ok) {
                toast.success("Item deleted");
                fetchGallery();
            } else {
                toast.error("Failed to delete item");
            }
        } catch (error) {
            toast.error("Failed to delete item");
        }
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-playfair bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Media Gallery</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage school photos, activities and video content</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setBulkItems([]);
                            setIsBulkModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-2xl hover:bg-gray-50 transition-all font-semibold shadow-sm"
                    >
                        Bulk Add
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl hover:bg-primary/90 transition-all font-semibold shadow-lg shadow-primary/20"
                    >
                        <Plus className="w-5 h-5" />
                        Add Media
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by title or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-3 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 text-sm font-medium pr-8"
                        >
                            <option value="All">All Categories</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {isLoading ? (
                    Array(8).fill(null).map((_, i) => (
                        <div key={i} className="bg-white rounded-3xl border border-gray-100 p-4 space-y-4 animate-pulse">
                            <div className="aspect-video bg-gray-100 rounded-2xl" />
                            <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                            <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                        </div>
                    ))
                ) : filteredItems.map((item) => (
                    <div
                        key={item._id.toString()}
                        onClick={() => setPreviewItem(item)}
                        className="bg-white rounded-3xl border border-gray-100 p-3 group transition-all hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-1 flex flex-col cursor-pointer"
                    >
                        <div className="aspect-4/3 relative overflow-hidden rounded-2xl bg-gray-50">
                            <Image
                                fill
                                src={item.type === 'video' ?
                                    (item.thumbnailUrl || (item.imageUrl?.includes('res.cloudinary.com') ? item.imageUrl.replace(/\.[^/.]+$/, ".jpg") : "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=400&auto=format&fit=crop"))
                                    : (item.imageUrl || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=400&auto=format&fit=crop")
                                }
                                alt={item.title || "Gallery Item"}
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                unoptimized={item.type === 'video'}
                            />

                            {/* Overlay Badges */}
                            <div className="absolute top-3 left-3 flex flex-col gap-2">
                                <span className={cn(
                                    "px-3 py-1 bg-white/90 backdrop-blur-md border border-white/20 text-[10px] font-bold rounded-lg shadow-sm tracking-wider uppercase",
                                    item.type === 'video' ? "text-red-600" : "text-blue-600"
                                )}>
                                    {item.type}
                                </span>
                            </div>

                            <div className="absolute top-3 right-3">
                                <span className="px-3 py-1 bg-primary/90 backdrop-blur-md text-white text-[10px] font-bold rounded-lg shadow-lg">
                                    {item.category}
                                </span>
                            </div>

                            {item.type === 'video' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-500">
                                        <Play className="w-5 h-5 text-primary fill-primary ml-1" />
                                    </div>
                                </div>
                            )}

                            {/* Actions Overlay */}
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
                                <div className="flex gap-2 w-full">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleOpenModal(item); }}
                                        className="flex-1 bg-white/20 backdrop-blur-md border border-white/30 text-white p-2.5 rounded-xl hover:bg-white/40 transition-all flex items-center justify-center gap-2 text-xs font-semibold"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}
                                        className="flex-1 bg-red-500/80 backdrop-blur-md border border-red-400/30 text-white p-2.5 rounded-xl hover:bg-red-500 transition-all flex items-center justify-center gap-2 text-xs font-semibold"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 space-y-2">
                            <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{item.title}</h3>
                            <div className="flex items-center gap-4 p-6 bg-linear-to-r from-primary to-indigo-600 text-white text-[11px] font-medium rounded-2xl">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span className="opacity-80" suppressHydrationWarning>
                                        {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-white/30" />
                                <div className="flex items-center gap-1.5 uppercase tracking-tighter">
                                    {item.type === 'video' ? <Video className="w-3.5 h-3.5 text-red-400" /> : <ImageIcon className="w-3.5 h-3.5 text-blue-400" />}
                                    {item.type}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!isLoading && filteredItems.length === 0 && (
                <div className="text-center py-32 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200 mx-auto max-w-2xl animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-gray-100">
                        <ImageIcon className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">No media found</h3>
                    <p className="text-gray-500 mt-2 max-w-sm mx-auto">Try adjusting your search or category filters, or add new content.</p>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? "Edit Media" : "Add New Media"}
            >
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-900 ml-1">Title</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Annual Sports Day 2024"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-gray-50 border-gray-100 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-900 ml-1">Date</label>
                                <input
                                    required
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full bg-gray-50 border-gray-100 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-900 ml-1">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-gray-50 border-gray-100 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm"
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-900 ml-1">Media Type</label>
                                <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: 'image', imageUrl: '', publicId: '' })}
                                        className={cn(
                                            "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all",
                                            formData.type === 'image' ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"
                                        )}
                                    >
                                        <ImageIcon className="w-3.5 h-3.5" />
                                        IMAGE
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: 'video', imageUrl: '', publicId: 'manual' })}
                                        className={cn(
                                            "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all",
                                            formData.type === 'video' ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"
                                        )}
                                    >
                                        <Video className="w-3.5 h-3.5" />
                                        VIDEO
                                    </button>
                                </div>
                            </div>
                        </div>

                        {formData.type === 'image' ? (
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-900 ml-1">Upload Photo</label>
                                <CloudinaryUpload
                                    value={formData.imageUrl}
                                    onChange={(url, publicId) => setFormData({ ...formData, imageUrl: url, publicId })}
                                    onRemove={() => setFormData({ ...formData, imageUrl: "", publicId: "" })}
                                />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-900 ml-1">YouTube Video URL</label>
                                <div className="relative group">
                                    <Play className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                                    <input
                                        required={formData.type === 'video'}
                                        type="text"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        className="w-full bg-gray-50 border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-medium text-sm"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1 ml-1 flex items-center gap-1">
                                    <ExternalLink className="w-3 h-3" />
                                    Thumbnails are automatically generated from YouTube.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 bg-white border border-gray-200 text-gray-600 font-bold py-4 rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving || !formData.imageUrl}
                            className={cn(
                                "flex-2 bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2",
                                (isSaving || !formData.imageUrl) ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90 hover:-translate-y-1"
                            )}
                        >
                            {isSaving ? "Saving..." : (editingId ? "Save Changes" : "Upload Media")}
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
                title="Bulk Upload Media"
            >
                <form onSubmit={handleBulkSave} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-900 ml-1">Category</label>
                            <select
                                value={bulkFormData.category}
                                onChange={(e) => setBulkFormData({ ...bulkFormData, category: e.target.value })}
                                className="w-full bg-gray-50 border-gray-100 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-900 ml-1">Date</label>
                            <input
                                required
                                type="date"
                                value={bulkFormData.date}
                                onChange={(e) => setBulkFormData({ ...bulkFormData, date: e.target.value })}
                                className="w-full bg-gray-50 border-gray-100 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-900 ml-1">Media Type</label>
                        <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
                            <button
                                type="button"
                                onClick={() => setBulkFormData({ ...bulkFormData, type: 'image' })}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all",
                                    bulkFormData.type === 'image' ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                <ImageIcon className="w-3.5 h-3.5" />
                                IMAGE
                            </button>
                            <button
                                type="button"
                                onClick={() => setBulkFormData({ ...bulkFormData, type: 'video' })}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all",
                                    bulkFormData.type === 'video' ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                <Video className="w-3.5 h-3.5" />
                                VIDEO
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-gray-900 ml-1">
                                Files ({bulkItems.length} selected)
                            </label>
                            {bulkItems.length > 0 && (
                                <button type="button" onClick={() => setBulkItems([])} className="text-xs text-red-500 hover:underline">
                                    Clear all
                                </button>
                            )}
                        </div>

                        {!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
                            <div className="p-4 text-center bg-red-50 text-red-600 rounded-xl text-sm font-semibold border border-red-100">
                                Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME inside .env!
                            </div>
                        ) : (
                            <CldUploadWidget
                                onSuccess={(result: any) => {
                                    setBulkItems(prev => [...prev, {
                                        imageUrl: result.info.secure_url,
                                        publicId: result.info.public_id,
                                    }]);
                                }}
                                signatureEndpoint="/api/cloudinary/sign"
                                options={{
                                    maxFiles: 50,
                                    multiple: true,
                                    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default",
                                    folder: "gallery",
                                    resourceType: "auto",
                                }}
                            >
                                {({ open }) => (
                                    <button
                                        type="button"
                                        onClick={() => open()}
                                        className="w-full h-[120px] rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                                            <Plus className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-500 group-hover:text-primary">
                                            Click to open Cloudinary Selection
                                        </span>
                                    </button>
                                )}
                            </CldUploadWidget>
                        )}

                        {bulkItems.length > 0 && (
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {bulkItems.map((item, idx) => {
                                    const previewUrl = bulkFormData.type === 'video' && item.imageUrl ? item.imageUrl.replace(/\.[^/.]+$/, ".jpg") : item.imageUrl;
                                    return (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-100 group">
                                            <Image src={previewUrl} alt="upload-preview" fill className="object-cover" />
                                            <button
                                                type="button"
                                                title="Remove"
                                                onClick={() => setBulkItems(prev => prev.filter((_, i) => i !== idx))}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsBulkModalOpen(false)}
                            className="flex-1 bg-white border border-gray-200 text-gray-600 font-bold py-4 rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving || bulkItems.length === 0}
                            className={cn(
                                "flex-2 bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2",
                                (isSaving || bulkItems.length === 0) ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90 hover:-translate-y-1"
                            )}
                        >
                            {isSaving ? "Saving..." : `Save ${bulkItems.length} items`}
                        </button>
                    </div>
                </form>
            </Modal>

            {previewItem && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                    onClick={() => setPreviewItem(null)}
                >
                    <div
                        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setPreviewItem(null)}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors bg-white/10 p-2 rounded-full"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <div className="bg-black rounded-2xl overflow-hidden aspect-video relative flex items-center justify-center shadow-2xl">
                            {previewItem?.type === 'video' ? (
                                (previewItem.imageUrl.includes('youtube.com') || previewItem.imageUrl.includes('youtu.be')) ? (
                                    <iframe
                                        src={previewItem.imageUrl.includes('watch?v=') ? previewItem.imageUrl.replace('watch?v=', 'embed/').split('&')[0] : previewItem.imageUrl}
                                        className="w-full h-full"
                                        allowFullScreen
                                    />
                                ) : (
                                    <video
                                        src={previewItem.imageUrl}
                                        controls
                                        autoPlay
                                        className="w-full h-full rounded-2xl"
                                    />
                                )
                            ) : (
                                <Image
                                    src={previewItem?.imageUrl || ""}
                                    alt={previewItem?.title || ""}
                                    fill
                                    className="object-contain"
                                />
                            )}
                        </div>
                        <h3 className="text-white text-xl font-semibold mt-4 text-center">{previewItem?.title}</h3>
                    </div>
                </div>
            )}
        </div>
    );
}

