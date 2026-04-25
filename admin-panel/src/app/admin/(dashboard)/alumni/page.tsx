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
    User,
    MessageSquare,
    Calendar,
    Save,
    X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Modal from "@/components/Modal";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "members" | "testimonials" | "events";

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
    const [activeTab, setActiveTab] = useState<Tab>("members");
    const [items, setItems] = useState<Alumni[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Testimonials state
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [testimonialsLoading, setTestimonialsLoading] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<any | null>(null);
    const [tForm, setTForm] = useState({ name: "", batch: new Date().getFullYear(), designation: "", quote: "", isActive: true, displayOrder: 0 });
    const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);

    // Events state
    const [events, setEvents] = useState<any[]>([]);
    const [eventsLoading, setEventsLoading] = useState(false);
    const [editingEvent, setEditingEvent] = useState<any | null>(null);
    const [eForm, setEForm] = useState({ name: "", date: "", location: "", type: "In-Person", description: "", color: "#3B82F6", isActive: true, displayOrder: 0 });
    const [isAddingEvent, setIsAddingEvent] = useState(false);
    const [tEventSaving, setTEventSaving] = useState(false);

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

    const schoolId = () => (typeof window !== "undefined" ? localStorage.getItem("selectedSchool") || "" : "");

    useEffect(() => {
        fetchAlumni();
        fetchTestimonials();
        fetchEvents();
    }, []);

    const fetchAlumni = async () => {
        setIsLoading(true);
        try {
            const sid = schoolId();
            const res = await fetch(`/api/alumni?schoolId=${sid}`);
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

    const fetchTestimonials = async () => {
        setTestimonialsLoading(true);
        try {
            const sid = schoolId();
            const res = await fetch(`/api/alumni-testimonials?schoolId=${sid}`);
            if (res.ok) setTestimonials(await res.json());
        } catch { toast.error("Failed to fetch testimonials"); }
        finally { setTestimonialsLoading(false); }
    };

    const fetchEvents = async () => {
        setEventsLoading(true);
        try {
            const sid = schoolId();
            const res = await fetch(`/api/alumni-events?schoolId=${sid}`);
            if (res.ok) setEvents(await res.json());
        } catch { toast.error("Failed to fetch events"); }
        finally { setEventsLoading(false); }
    };

    const saveTestimonial = async (e: React.FormEvent) => {
        e.preventDefault();
        setTEventSaving(true);
        try {
            const sid = schoolId();
            const url = editingTestimonial ? `/api/alumni-testimonials/${editingTestimonial._id}` : "/api/alumni-testimonials";
            const method = editingTestimonial ? "PUT" : "POST";
            const res = await fetch(url, { method, headers: { "Content-Type": "application/json", "x-school-id": sid }, body: JSON.stringify(tForm) });
            if (res.ok) {
                toast.success(editingTestimonial ? "Updated!" : "Created!");
                setEditingTestimonial(null);
                setIsAddingTestimonial(false);
                setTForm({ name: "", batch: new Date().getFullYear(), designation: "", quote: "", isActive: true, displayOrder: 0 });
                fetchTestimonials();
            } else { toast.error("Failed to save testimonial"); }
        } catch { toast.error("An error occurred"); }
        finally { setTEventSaving(false); }
    };

    const deleteTestimonial = async (id: string) => {
        if (!confirm("Delete this testimonial?")) return;
        const res = await fetch(`/api/alumni-testimonials/${id}`, { method: "DELETE" });
        if (res.ok) { toast.success("Deleted"); fetchTestimonials(); } else toast.error("Failed");
    };

    const saveEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        setTEventSaving(true);
        try {
            const sid = schoolId();
            const url = editingEvent ? `/api/alumni-events/${editingEvent._id}` : "/api/alumni-events";
            const method = editingEvent ? "PUT" : "POST";
            const res = await fetch(url, { method, headers: { "Content-Type": "application/json", "x-school-id": sid }, body: JSON.stringify(eForm) });
            if (res.ok) {
                toast.success(editingEvent ? "Updated!" : "Created!");
                setEditingEvent(null);
                setIsAddingEvent(false);
                setEForm({ name: "", date: "", location: "", type: "In-Person", description: "", color: "#3B82F6", isActive: true, displayOrder: 0 });
                fetchEvents();
            } else { toast.error("Failed to save event"); }
        } catch { toast.error("An error occurred"); }
        finally { setTEventSaving(false); }
    };

    const deleteEvent = async (id: string) => {
        if (!confirm("Delete this event?")) return;
        const res = await fetch(`/api/alumni-events/${id}`, { method: "DELETE" });
        if (res.ok) { toast.success("Deleted"); fetchEvents(); } else toast.error("Failed");
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
                    <p className="text-gray-500">Manage alumni profiles, testimonials, and events</p>
                </div>
                {activeTab === "members" && (
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20 self-start"
                    >
                        <Plus className="w-5 h-5" />
                        New Alumni
                    </button>
                )}
                {activeTab === "testimonials" && (
                    <button
                        onClick={() => { setIsAddingTestimonial(true); setEditingTestimonial(null); setTForm({ name: "", batch: new Date().getFullYear(), designation: "", quote: "", isActive: true, displayOrder: 0 }); }}
                        className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20 self-start"
                    >
                        <Plus className="w-5 h-5" />
                        New Testimonial
                    </button>
                )}
                {activeTab === "events" && (
                    <button
                        onClick={() => { setIsAddingEvent(true); setEditingEvent(null); setEForm({ name: "", date: "", location: "", type: "In-Person", description: "", color: "#3B82F6", isActive: true, displayOrder: 0 }); }}
                        className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20 self-start"
                    >
                        <Plus className="w-5 h-5" />
                        New Event
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
                {(["members", "testimonials", "events"] as Tab[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "px-5 py-2 rounded-xl font-bold capitalize text-sm transition-all",
                            activeTab === tab ? "bg-white shadow text-primary" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        {tab === "members" && <GraduationCap className="w-4 h-4 inline mr-1.5" />}
                        {tab === "testimonials" && <MessageSquare className="w-4 h-4 inline mr-1.5" />}
                        {tab === "events" && <Calendar className="w-4 h-4 inline mr-1.5" />}
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === "members" && (
                <>
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
                </>
            )} {/* end activeTab === members */}

            {/* ───────── TESTIMONIALS TAB ───────── */}
            {activeTab === "testimonials" && (
                <div className="space-y-4">
                    {(isAddingTestimonial || editingTestimonial) && (
                        <form onSubmit={saveTestimonial} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
                            <h3 className="font-black text-slate-700">{editingTestimonial ? "Edit Testimonial" : "New Testimonial"}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Alumni Name</label>
                                    <input required value={tForm.name} onChange={e => setTForm({ ...tForm, name: e.target.value })} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all" placeholder="e.g. Rahul Sharma" /></div>
                                <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Batch Year</label>
                                    <input required type="number" value={tForm.batch} onChange={e => setTForm({ ...tForm, batch: Number(e.target.value) })} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all" /></div>
                                <div className="space-y-1 md:col-span-2"><label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Designation / Achievement</label>
                                    <input required value={tForm.designation} onChange={e => setTForm({ ...tForm, designation: e.target.value })} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all" placeholder="e.g. IIT-JEE Rank 124, IIT Delhi" /></div>
                                <div className="space-y-1 md:col-span-2"><label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quote / Testimonial</label>
                                    <textarea required rows={3} value={tForm.quote} onChange={e => setTForm({ ...tForm, quote: e.target.value })} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all" placeholder="What the alumni says..." /></div>
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" disabled={tEventSaving} className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow disabled:opacity-50">
                                    <Save className="w-4 h-4" />{tEventSaving ? "Saving..." : editingTestimonial ? "Save Changes" : "Create"}
                                </button>
                                <button type="button" onClick={() => { setIsAddingTestimonial(false); setEditingTestimonial(null); }} className="flex items-center gap-2 bg-slate-100 text-slate-600 px-6 py-3 rounded-xl font-bold">
                                    <X className="w-4 h-4" />Cancel
                                </button>
                            </div>
                        </form>
                    )}
                    {testimonialsLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[1, 2].map(i => <div key={i} className="bg-white rounded-3xl h-32 animate-pulse border border-gray-100" />)}</div>
                    ) : testimonials.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
                            <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                            <p className="text-slate-400 font-medium">No testimonials yet. Add the first one!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {testimonials.map(t => (
                                <div key={t._id} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                                    <p className="text-slate-600 italic text-sm mb-3">&ldquo;{t.quote}&rdquo;</p>
                                    <div className="flex items-center justify-between">
                                        <div><p className="font-bold text-slate-800 text-sm">{t.name}</p><p className="text-xs text-slate-400">{t.designation} · Batch {t.batch}</p></div>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setEditingTestimonial(t); setTForm({ name: t.name, batch: t.batch, designation: t.designation, quote: t.quote, isActive: t.isActive, displayOrder: t.displayOrder }); setIsAddingTestimonial(false); }} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"><Pencil className="w-4 h-4" /></button>
                                            <button onClick={() => deleteTestimonial(t._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ───────── EVENTS TAB ───────── */}
            {activeTab === "events" && (
                <div className="space-y-4">
                    {(isAddingEvent || editingEvent) && (
                        <form onSubmit={saveEvent} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
                            <h3 className="font-black text-slate-700">{editingEvent ? "Edit Event" : "New Event"}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Event Name</label>
                                    <input required value={eForm.name} onChange={e => setEForm({ ...eForm, name: e.target.value })} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all" placeholder="e.g. Annual Alumni Meet 2025" /></div>
                                <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date</label>
                                    <input required type="date" value={eForm.date} onChange={e => setEForm({ ...eForm, date: e.target.value })} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all" /></div>
                                <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location</label>
                                    <input required value={eForm.location} onChange={e => setEForm({ ...eForm, location: e.target.value })} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all" placeholder="e.g. School Auditorium" /></div>
                                <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Type</label>
                                    <select value={eForm.type} onChange={e => setEForm({ ...eForm, type: e.target.value })} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all">
                                        <option>In-Person</option><option>Online</option><option>Hybrid</option>
                                    </select></div>
                                <div className="space-y-1 md:col-span-2"><label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</label>
                                    <textarea required rows={2} value={eForm.description} onChange={e => setEForm({ ...eForm, description: e.target.value })} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all" /></div>
                                <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Accent Color</label>
                                    <div className="flex items-center gap-3"><input type="color" value={eForm.color} onChange={e => setEForm({ ...eForm, color: e.target.value })} className="w-12 h-10 rounded-xl border-none cursor-pointer" /><span className="text-sm text-slate-500 font-mono">{eForm.color}</span></div></div>
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" disabled={tEventSaving} className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow disabled:opacity-50">
                                    <Save className="w-4 h-4" />{tEventSaving ? "Saving..." : editingEvent ? "Save Changes" : "Create"}
                                </button>
                                <button type="button" onClick={() => { setIsAddingEvent(false); setEditingEvent(null); }} className="flex items-center gap-2 bg-slate-100 text-slate-600 px-6 py-3 rounded-xl font-bold">
                                    <X className="w-4 h-4" />Cancel
                                </button>
                            </div>
                        </form>
                    )}
                    {eventsLoading ? (
                        <div className="space-y-3">{[1, 2].map(i => <div key={i} className="bg-white rounded-3xl h-24 animate-pulse border border-gray-100" />)}</div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
                            <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                            <p className="text-slate-400 font-medium">No events yet. Add the first one!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {events.map(ev => (
                                <div key={ev._id} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center justify-between gap-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: ev.color + '22' }}>
                                            <Calendar className="w-5 h-5" style={{ color: ev.color }} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{ev.name}</p>
                                            <p className="text-xs text-slate-400">{ev.date} · {ev.location} · {ev.type}</p>
                                            <p className="text-sm text-slate-500 mt-0.5">{ev.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <button onClick={() => { setEditingEvent(ev); setEForm({ name: ev.name, date: ev.date, location: ev.location, type: ev.type, description: ev.description, color: ev.color, isActive: ev.isActive, displayOrder: ev.displayOrder }); setIsAddingEvent(false); }} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"><Pencil className="w-4 h-4" /></button>
                                        <button onClick={() => deleteEvent(ev._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
