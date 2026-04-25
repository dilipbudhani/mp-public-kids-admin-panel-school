"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Calendar,
    Search,
    MapPin,
    Tag,
    Clock,
    LayoutList,
    Table as TableIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Modal from "@/components/Modal";

interface EventItem {
    _id: string;
    title: string;
    date: string;
    endDate?: string;
    type: string;
    category: string;
    description: string;
    location?: string;
    isActive: boolean;
}

const CATEGORIES = ['Holiday', 'Exam', 'Event', 'Celebration', 'Competition', 'Meeting'];

export default function EventsAdminPage() {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<'list' | 'table'>('table');

    const [formData, setFormData] = useState({
        title: "",
        date: new Date().toISOString().split('T')[0],
        endDate: "",
        type: "Academic",
        category: "Event",
        description: "",
        location: "",
        isActive: true
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const schoolId = typeof window !== 'undefined' ? localStorage.getItem("selectedSchool") : null;
            const res = await fetch(`/api/events${schoolId ? `?schoolId=${schoolId}` : ""}`);
            if (res.ok) {
                const data = await res.json();
                setEvents(data);
            }
        } catch (error) {
            toast.error("Failed to fetch events");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (item?: EventItem) => {
        if (item) {
            setEditingId(item._id);
            setFormData({
                title: item.title,
                date: new Date(item.date).toISOString().split('T')[0],
                endDate: item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : "",
                type: item.type,
                category: item.category,
                description: item.description,
                location: item.location || "",
                isActive: item.isActive !== undefined ? item.isActive : true
            });
        } else {
            setEditingId(null);
            setFormData({
                title: "",
                date: new Date().toISOString().split('T')[0],
                endDate: "",
                type: "Academic",
                category: "Event",
                description: "",
                location: "",
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
            const url = editingId ? `/api/events/${editingId}` : "/api/events";

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
                toast.success(`Event ${editingId ? "updated" : "added"} successfully`);
                fetchEvents();
                setIsModalOpen(false);
            } else {
                toast.error("Failed to save event");
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
            const res = await fetch(`/api/events/${id}`, {
                method: "DELETE",
                headers: {
                    ...(schoolId && { "x-school-id": schoolId })
                }
            });
            if (res.ok) {
                toast.success("Event deleted");
                fetchEvents();
            } else {
                toast.error("Failed to delete event");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const filteredEvents = events.filter(e =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black font-playfair bg-linear-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">Academic Calendar</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium italic">Manage school events, holidays, and examination schedules</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1">
                        <button
                            onClick={() => setViewMode('table')}
                            className={cn(
                                "p-2.5 rounded-xl transition-all",
                                viewMode === 'table' ? "bg-white shadow-sm text-primary" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <TableIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                "p-2.5 rounded-xl transition-all",
                                viewMode === 'list' ? "bg-white shadow-sm text-primary" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <LayoutList className="w-5 h-5" />
                        </button>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl hover:bg-primary/90 transition-all font-bold shadow-xl shadow-primary/20 hover:-translate-y-1"
                    >
                        <Plus className="w-5 h-5" />
                        New Event
                    </button>
                </div>
            </div>

            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search events by title or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-6 py-5 focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm text-lg font-medium"
                />
            </div>

            {viewMode === 'table' ? (
                <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-xl shadow-slate-200/50 overflow-hidden text-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/50">
                                <th className="px-8 py-6 font-black uppercase tracking-widest text-slate-400 text-[10px]">Date</th>
                                <th className="px-8 py-6 font-black uppercase tracking-widest text-slate-400 text-[10px]">Title</th>
                                <th className="px-8 py-6 font-black uppercase tracking-widest text-slate-400 text-[10px]">Category</th>
                                <th className="px-8 py-6 font-black uppercase tracking-widest text-slate-400 text-[10px]">Location</th>
                                <th className="px-8 py-6 font-black uppercase tracking-widest text-slate-400 text-[10px]">Status</th>
                                <th className="px-8 py-6 font-black uppercase tracking-widest text-slate-400 text-[10px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                Array(5).fill(null).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-8 py-6"><div className="h-4 bg-slate-100 rounded w-full" /></td>
                                    </tr>
                                ))
                            ) : filteredEvents.map((item) => (
                                <tr key={item._id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-8 py-6 font-bold text-slate-900">
                                        {new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                        {item.endDate && ` - ${new Date(item.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`}
                                        <div className="text-[10px] text-slate-400 font-medium">
                                            {new Date(item.date).getFullYear()}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-bold text-slate-900 group-hover:text-primary transition-colors">{item.title}</div>
                                        <div className="text-slate-400 text-[11px] font-medium leading-tight line-clamp-1">{item.description}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-slate-500 font-medium"> {item.location || "N/A"} </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg",
                                            item.isActive ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"
                                        )}>
                                            {item.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleOpenModal(item)} className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-primary hover:text-white transition-all"><Pencil className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(item._id)} className="p-2.5 bg-red-100 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredEvents.map((item) => (
                        <div key={item._id} className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm hover:shadow-xl transition-all group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{new Date(item.date).toLocaleDateString()}</span>
                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">{item.title}</h3>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg">{item.category}</span>
                                    <span className={cn(
                                        "px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-md",
                                        item.isActive ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"
                                    )}>
                                        {item.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </div>
                            <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed">{item.description}</p>
                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-2 text-slate-400 font-medium text-xs">
                                    <MapPin className="w-4 h-4" />
                                    {item.location || "School Campus"}
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleOpenModal(item)} className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-primary hover:text-white transition-all"><Pencil className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(item._id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? "Edit Event" : "Create New Event"}
            >
                <form onSubmit={handleSave} className="space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Event Title</label>
                            <input
                                required
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Start Date</label>
                                <input
                                    required
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">End Date (Optional)</label>
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                                />
                            </div>
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
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-bold h-[58px]"
                                >
                                    <option value="Academic">Academic</option>
                                    <option value="Co-curricular">Co-curricular</option>
                                    <option value="Administrative">Administrative</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Location</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="e.g. Auditorium, Sports Ground"
                                className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                            <textarea
                                required
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm"
                            />
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-5 h-5 rounded-lg border-slate-300 text-primary focus:ring-primary transition-all"
                            />
                            <label htmlFor="isActive" className="text-sm font-bold text-slate-700 cursor-pointer">
                                Active (Show on Website)
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-slate-50">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 bg-white border border-slate-200 text-slate-500 font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-2 bg-primary text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                        >
                            {isSaving ? "Saving..." : (editingId ? "Update Event" : "Add to Calendar")}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
