"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Star,
    Quote,
    User,
    Search,
    Filter,
    MoreVertical,
    CheckCircle2,
    XCircle
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Modal from "@/components/Modal";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
    _id: string;
    name: string;
    role: string;
    content: string;
    rating: number;
    avatarUrl?: string;
    isActive: boolean;
    displayOrder: number;
}

const ROLES = ['Parent', 'Student', 'Alumni', 'Staff', 'Visitor'];

export default function TestimonialsAdminPage() {
    const [items, setItems] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRole, setSelectedRole] = useState("All");

    const [formData, setFormData] = useState({
        name: "",
        role: "Parent",
        content: "",
        rating: 5,
        avatarUrl: "",
        isActive: true,
        displayOrder: 0
    });

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        setIsLoading(true);
        try {
            const schoolId = typeof window !== 'undefined' ? localStorage.getItem("selectedSchool") : null;
            const res = await fetch(`/api/testimonials${schoolId ? `?schoolId=${schoolId}` : ""}`);
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (error) {
            toast.error("Failed to fetch testimonials");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (item?: Testimonial) => {
        if (item) {
            setEditingId(item._id);
            setFormData({
                name: item.name,
                role: item.role,
                content: item.content,
                rating: item.rating,
                avatarUrl: item.avatarUrl || "",
                isActive: item.isActive,
                displayOrder: item.displayOrder
            });
        } else {
            setEditingId(null);
            setFormData({
                name: "",
                role: "Parent",
                content: "",
                rating: 5,
                avatarUrl: "",
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
            const url = editingId ? `/api/testimonials/${editingId}` : "/api/testimonials";

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
                toast.success(`Testimonial ${editingId ? "updated" : "added"} successfully`);
                fetchTestimonials();
                setIsModalOpen(false);
            } else {
                toast.error("Failed to save testimonial");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;

        try {
            const schoolId = typeof window !== 'undefined' ? localStorage.getItem("selectedSchool") : null;
            const res = await fetch(`/api/testimonials/${id}`, {
                method: "DELETE",
                headers: {
                    ...(schoolId && { "x-school-id": schoolId })
                }
            });

            if (res.ok) {
                toast.success("Testimonial deleted");
                fetchTestimonials();
            } else {
                toast.error("Failed to delete testimonial");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const toggleStatus = async (item: Testimonial) => {
        try {
            const schoolId = typeof window !== 'undefined' ? localStorage.getItem("selectedSchool") : null;
            const res = await fetch(`/api/testimonials/${item._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(schoolId && { "x-school-id": schoolId })
                },
                body: JSON.stringify({ ...item, isActive: !item.isActive }),
            });

            if (res.ok) {
                toast.success("Status updated");
                fetchTestimonials();
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = selectedRole === "All" || item.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-playfair">Testimonials</h1>
                    <p className="text-gray-500">Manage student and parent reviews</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20 self-start"
                >
                    <Plus className="w-5 h-5" />
                    New Testimonial
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search testimonials..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary transition-all text-sm"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    <button
                        onClick={() => setSelectedRole("All")}
                        className={cn(
                            "px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                            selectedRole === "All" ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                    >
                        All Roles
                    </button>
                    {ROLES.map(role => (
                        <button
                            key={role}
                            onClick={() => setSelectedRole(role)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                                selectedRole === role ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            )}
                        >
                            {role}
                        </button>
                    ))}
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
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                className={cn(
                                    "bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden",
                                    !item.isActive && "opacity-75 grayscale-[0.5]"
                                )}
                            >
                                {/* Active Badge */}
                                <div className="absolute top-4 right-4 z-10">
                                    <button
                                        onClick={() => toggleStatus(item)}
                                        className={cn(
                                            "p-2 rounded-full transition-all",
                                            item.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                                        )}
                                        title={item.isActive ? "Active" : "Inactive"}
                                    >
                                        {item.isActive ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                    </button>
                                </div>

                                <Quote className="w-10 h-10 text-primary/10 absolute -top-2 -left-2 rotate-12" />

                                <div className="space-y-4 pt-4">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={cn(
                                                    "w-4 h-4",
                                                    i < item.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                                                )}
                                            />
                                        ))}
                                    </div>

                                    <p className="text-gray-700 italic line-clamp-4 leading-relaxed">
                                        "{item.content}"
                                    </p>

                                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                                        <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-primary/10">
                                            {item.avatarUrl ? (
                                                <img src={item.avatarUrl} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-6 h-6 text-gray-400" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                                            <p className="text-xs text-primary font-medium">{item.role}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleOpenModal(item)}
                                            className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-all"
                                            title="Edit"
                                        >
                                            <Pencil className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-all"
                                            title="Delete"
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

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? "Edit Testimonial" : "Add New Testimonial"}
            >
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Name</label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Role</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all appearance-none"
                            >
                                {ROLES.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rating (1-5)</label>
                            <div className="flex items-center gap-2 pt-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => setFormData({ ...formData, rating: star })}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={cn(
                                                "w-8 h-8",
                                                star <= formData.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                                            )}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avatar URL</label>
                            <input
                                type="text"
                                value={formData.avatarUrl}
                                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
                                placeholder="https://..."
                            />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Review Content</label>
                            <textarea
                                required
                                rows={4}
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
                                placeholder="Enter the student or parent's feedback..."
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
                            <label htmlFor="isActive" className="text-sm font-bold text-gray-500 uppercase tracking-wider cursor-pointer">Show on Public Page</label>
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
                            {isSaving ? "Saving..." : "Save Testimonial"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
