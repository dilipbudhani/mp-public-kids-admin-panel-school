"use client";

import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, MoveUp, MoveDown, Save, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface HeroSlide {
    _id: string;
    title: string;
    highlight: string;
    description: string;
    badge: string;
    cta1Text: string;
    cta1Href: string;
    cta2Text: string;
    cta2Href: string;
    imageUrl: string;
    statValue: string;
    statLabel: string;
    displayOrder: number;
    isActive: boolean;
}

export default function HeroAdminPage() {
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<HeroSlide>>({});

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/hero");
            if (res.ok) {
                const data = await res.json();
                setSlides(data);
            }
        } catch (error) {
            toast.error("Failed to fetch slides");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (slide: HeroSlide) => {
        setIsEditing(slide._id);
        setEditForm(slide);
    };

    const handleCancel = () => {
        setIsEditing(null);
        setEditForm({});
    };

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/hero/${isEditing}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm),
            });

            if (res.ok) {
                toast.success("Slide updated successfully");
                fetchSlides();
                setIsEditing(null);
            } else {
                toast.error("Failed to update slide");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this slide?")) return;

        try {
            const res = await fetch(`/api/hero/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Slide deleted");
                fetchSlides();
            }
        } catch (error) {
            toast.error("Failed to delete slide");
        }
    };

    const handleAdd = async () => {
        const newSlide = {
            title: "New Slide",
            highlight: "Special Highlight",
            description: "Detailed description of the slide",
            badge: "NEW",
            imageUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop",
            displayOrder: slides.length,
            isActive: true,
            cta1Text: "Learn More",
            cta1Href: "#",
            cta2Text: "Contact Us",
            cta2Href: "/contact",
            statValue: "100%",
            statLabel: "Satisfaction",
        };

        try {
            const res = await fetch("/api/hero", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newSlide),
            });

            if (res.ok) {
                toast.success("New slide added");
                fetchSlides();
            }
        } catch (error) {
            toast.error("Failed to add slide");
        }
    };

    if (isLoading) {
        return <div className="animate-pulse">Loading slides...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold font-playfair">Hero Carousel</h1>
                    <p className="text-gray-500">Manage the main homepage banners</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/90 transition-all font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Add Slide
                </button>
            </div>

            <div className="grid gap-6">
                {slides.map((slide) => (
                    <div
                        key={slide._id}
                        className={cn(
                            "bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all shadow-sm hover:shadow-md",
                            isEditing === slide._id && "ring-2 ring-primary border-transparent"
                        )}
                    >
                        <div className="flex flex-col md:flex-row">
                            {/* Slide Preview */}
                            <div className="md:w-64 h-48 relative bg-gray-100">
                                {slide.imageUrl ? (
                                    <img
                                        src={slide.imageUrl}
                                        alt={slide.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <ImageIcon className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded-lg text-xs backdrop-blur-sm">
                                    Sort: {slide.displayOrder}
                                </div>
                            </div>

                            {/* Content & Actions */}
                            <div className="flex-1 p-6">
                                {isEditing === slide._id ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Title</label>
                                                <input
                                                    type="text"
                                                    value={editForm.title || ""}
                                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary transition-all"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Image URL</label>
                                                <input
                                                    type="text"
                                                    value={editForm.imageUrl || ""}
                                                    onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary transition-all"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Highlight</label>
                                                <input
                                                    type="text"
                                                    value={editForm.highlight || ""}
                                                    onChange={(e) => setEditForm({ ...editForm, highlight: e.target.value })}
                                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary transition-all"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Badge</label>
                                                <input
                                                    type="text"
                                                    value={editForm.badge || ""}
                                                    onChange={(e) => setEditForm({ ...editForm, badge: e.target.value })}
                                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary transition-all"
                                                />
                                            </div>
                                            <div className="space-y-1 md:col-span-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</label>
                                                <textarea
                                                    value={editForm.description || ""}
                                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary transition-all min-h-section-py"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">CTA 1 Text</label>
                                                <input
                                                    type="text"
                                                    value={editForm.cta1Text || ""}
                                                    onChange={(e) => setEditForm({ ...editForm, cta1Text: e.target.value })}
                                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary transition-all"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">CTA 1 Link</label>
                                                <input
                                                    type="text"
                                                    value={editForm.cta1Href || ""}
                                                    onChange={(e) => setEditForm({ ...editForm, cta1Href: e.target.value })}
                                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary transition-all"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">CTA 2 Text</label>
                                                <input
                                                    type="text"
                                                    value={editForm.cta2Text || ""}
                                                    onChange={(e) => setEditForm({ ...editForm, cta2Text: e.target.value })}
                                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary transition-all"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">CTA 2 Link</label>
                                                <input
                                                    type="text"
                                                    value={editForm.cta2Href || ""}
                                                    onChange={(e) => setEditForm({ ...editForm, cta2Href: e.target.value })}
                                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary transition-all"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Stat Value</label>
                                                <input
                                                    type="text"
                                                    value={editForm.statValue || ""}
                                                    onChange={(e) => setEditForm({ ...editForm, statValue: e.target.value })}
                                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary transition-all"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Stat Label</label>
                                                <input
                                                    type="text"
                                                    value={editForm.statLabel || ""}
                                                    onChange={(e) => setEditForm({ ...editForm, statLabel: e.target.value })}
                                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary transition-all"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={editForm.isActive ?? true}
                                                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                                                    className="min-h-section-py bg-neutral-50 border-neutral-200 focus:border-primary focus:ring-primary rounded-xl"
                                                    id="isActive"
                                                />
                                                <label htmlFor="isActive" className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active</label>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-3 mt-4">
                                            <button
                                                onClick={handleCancel}
                                                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all font-medium"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-xl hover:bg-primary/90 transition-all font-medium shadow-lg shadow-primary/20"
                                            >
                                                <Save className="w-5 h-5" />
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">{slide.title}</h3>
                                            <p className="text-primary font-semibold text-sm">{slide.highlight}</p>
                                            <p className="text-gray-500 text-sm line-clamp-2 mt-1">{slide.description}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-6">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(slide)}
                                                    className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-all"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(slide._id)}
                                                    className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {slide.isActive ? (
                                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Active</span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold">Inactive</span>
                                                )}
                                                <div className="flex items-center gap-1">
                                                    <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-all">
                                                        <MoveUp className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-all">
                                                        <MoveDown className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
