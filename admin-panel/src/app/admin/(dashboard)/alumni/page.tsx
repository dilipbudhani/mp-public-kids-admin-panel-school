"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    GraduationCap,
    Quote,
    MapPin,
    Briefcase,
    Search,
    CheckCircle2,
    XCircle,
    User
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Modal from "@/components/Modal";
import { motion, AnimatePresence } from "framer-motion";

interface Alumni {
    _id: string;
    name: string;
    batch: number;
    profession: string;
    organization: string;
    city: string;
    quote: string;
    initials: string;
    color: string;
    isActive: boolean;
    displayOrder: number;
}

const PRESET_COLORS = [
    '#3B82F6', // Blue
    '#8B5CF6', // Violet
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EC4899', // Pink
    '#EF4444', // Red
    '#0EA5E9', // Sky
    '#14B8A6', // Teal
    '#6366F1', // Indigo
    '#D97706', // Orange
];

export default function AlumniAdminPage() {
    const [items, setItems] = useState<Alumni[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        batch: new Date().getFullYear(),
        profession: "",
        organization: "",
        city: "",
        quote: "",
        initials: "",
        color: PRESET_COLORS[0],
        isActive: true,
        displayOrder: 0
    });

    useEffect(() => {
        fetchAlumni();
    }, []);

    const fetchAlumni = async () => {
        setIsLoading(true);
        try {
            const schoolId = localStorage.getItem("selectedSchool") || "mp-kids-school";
            const res = await fetch(`/api/alumni?schoolId=${schoolId}`);
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (error) {
            toast.error("Failed to fetch alumni");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (item?: Alumni) => {
        if (item) {
            setEditingId(item._id);
            setFormData({
                name: item.name,
                batch: item.batch,
                profession: item.profession,
                organization: item.organization,
                city: item.city,
                quote: item.quote,
                initials: item.initials,
                color: item.color,
                isActive: item.isActive,
                displayOrder: item.displayOrder
            });
        } else {
            setEditingId(null);
            setFormData({
                name: "",
                batch: new Date().getFullYear(),
                profession: "",
                organization: "",
                city: "",
                quote: "",
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
            const url = editingId ? `/api/alumni/${editingId}` : "/api/alumni";

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
                toast.success(`Alumni profile ${editingId ? "updated" : "added"} successfully`);
                fetchAlumni();
                setIsModalOpen(false);
            } else {
                toast.error("Failed to save alumni profile");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this alumni profile?")) return;

        try {
            const res = await fetch(`/api/alumni/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Alumni profile deleted");
                fetchAlumni();
            } else {
                toast.error("Failed to delete profile");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const toggleStatus = async (item: Alumni) => {
        try {
            const schoolId = localStorage.getItem("selectedSchool") || "mp-kids-school";
            const res = await fetch(`/api/alumni/${item._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-school-id": schoolId
                },
                body: JSON.stringify({ ...item, isActive: !item.isActive }),
            });

            if (res.ok) {
                toast.success("Status updated");
                fetchAlumni();
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.batch.toString().includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-playfair">Alumni Network</h1>
                    <p className="text-gray-500">Manage alumni profiles and success stories</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20 self-start"
                >
                    <Plus className="w-5 h-5" />
                    New Alumni
                </button>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, batch, profession..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary transition-all text-sm"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-3xl h-64 animate-pulse border border-gray-100" />
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
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ delay: index * 0.05 }}
                                className={cn(
                                    "bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden",
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
                                        {item.isActive ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-inner"
                                            style={{ backgroundColor: item.color }}
                                        >
                                            {item.initials}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg leading-tight">{item.name}</h3>
                                            <div className="flex items-center gap-1 text-primary text-sm font-medium">
                                                <GraduationCap className="w-4 h-4" />
                                                Batch {item.batch}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Briefcase className="w-4 h-4 text-gray-400" />
                                            <span className="truncate">
                                                {item.profession === item.organization
                                                    ? item.profession
                                                    : `${item.profession} at ${item.organization}`}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            <span>{item.city}</span>
                                        </div>
                                    </div>

                                    <div className="relative pt-2">
                                        <Quote className="w-8 h-8 text-primary/10 absolute -top-1 -left-1 rotate-12" />
                                        <p className="text-gray-500 text-sm italic line-clamp-3 relative z-10 pl-4 border-l-2 border-primary/20">
                                            "{item.quote}"
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleOpenModal(item)}
                                            className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-all"
                                        >
                                            <Pencil className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
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
                title={editingId ? "Edit Profile" : "Add New Alumni"}
            >
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                            <input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
                                placeholder="e.g. Arjun Kumar"
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
                                placeholder="e.g. AK"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Batch Year</label>
                            <input
                                required
                                type="number"
                                value={formData.batch}
                                onChange={(e) => setFormData({ ...formData, batch: parseInt(e.target.value) })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
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
                                            "w-8 h-8 rounded-lg transition-all scale-100 hover:scale-110",
                                            formData.color === c ? "ring-2 ring-offset-2 ring-primary scale-110 shadow-lg" : ""
                                        )}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Profession</label>
                            <input
                                required
                                value={formData.profession}
                                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
                                placeholder="e.g. IAS Officer"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Organization</label>
                            <input
                                required
                                value={formData.organization}
                                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
                                placeholder="e.g. Government of Rajasthan"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">City / Location</label>
                            <input
                                required
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
                                placeholder="e.g. Jaipur"
                            />
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
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quote / Message</label>
                            <textarea
                                required
                                rows={3}
                                value={formData.quote}
                                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
                                placeholder="Enter a short testimonial from the alumni..."
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
                            <label htmlFor="isActive" className="text-sm font-bold text-gray-500 uppercase tracking-wider cursor-pointer">Active Profile</label>
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
                            {isSaving ? "Saving..." : "Save Profile"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
