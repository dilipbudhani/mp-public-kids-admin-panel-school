"use client";

import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, TrendingUp, Save, X, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ICON_OPTIONS = [
    "Users", "Globe", "Award", "TrendingUp", "Stethoscope", "GraduationCap",
    "Trophy", "Star", "BookOpen", "Building", "Briefcase", "Heart",
    "Rocket", "Flag", "Medal", "Target"
];

interface Stat {
    _id?: string;
    label: string;
    value: number;
    suffix: string;
    icon: string;
    displayOrder: number;
    isActive: boolean;
}

const DEFAULT_STAT: Stat = {
    label: "",
    value: 0,
    suffix: "+",
    icon: "Star",
    displayOrder: 0,
    isActive: true,
};

export default function StatsPage() {
    const [stats, setStats] = useState<Stat[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<Stat>(DEFAULT_STAT);
    const [isAdding, setIsAdding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setIsLoading(true);
        try {
            const schoolId = typeof window !== "undefined" ? localStorage.getItem("selectedSchool") : null;
            const res = await fetch(`/api/stats${schoolId ? `?schoolId=${schoolId}` : ""}`);
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch {
            toast.error("Failed to fetch stats");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const schoolId = localStorage.getItem("selectedSchool") || "";
            const res = await fetch("/api/stats", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-school-id": schoolId,
                },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                toast.success("Stat created!");
                setIsAdding(false);
                setForm(DEFAULT_STAT);
                fetchStats();
            } else {
                toast.error("Failed to create stat");
            }
        } catch {
            toast.error("An error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingId) return;
        setIsSaving(true);
        try {
            const res = await fetch(`/api/stats/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                toast.success("Stat updated!");
                setEditingId(null);
                setForm(DEFAULT_STAT);
                fetchStats();
            } else {
                toast.error("Failed to update stat");
            }
        } catch {
            toast.error("An error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this stat?")) return;
        try {
            const res = await fetch(`/api/stats/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Stat deleted");
                fetchStats();
            } else {
                toast.error("Failed to delete stat");
            }
        } catch {
            toast.error("An error occurred");
        }
    };

    const startEdit = (stat: Stat) => {
        setEditingId(stat._id!);
        setForm({ ...stat });
        setIsAdding(false);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setIsAdding(false);
        setForm(DEFAULT_STAT);
    };

    const StatForm = ({ onSubmit, submitLabel }: { onSubmit: (e: React.FormEvent) => void; submitLabel: string }) => (
        <form onSubmit={onSubmit} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Label</label>
                    <input
                        required
                        type="text"
                        placeholder="e.g. IIT/NIT Selections"
                        value={form.label}
                        onChange={(e) => setForm({ ...form, label: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Value (Number)</label>
                    <input
                        required
                        type="number"
                        placeholder="e.g. 50"
                        value={form.value}
                        onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Suffix (+ or blank)</label>
                    <input
                        type="text"
                        placeholder="e.g. + or leave blank"
                        value={form.suffix}
                        onChange={(e) => setForm({ ...form, suffix: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Icon</label>
                    <select
                        value={form.icon}
                        onChange={(e) => setForm({ ...form, icon: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold focus:ring-4 focus:ring-primary/10 transition-all appearance-none"
                    >
                        {ICON_OPTIONS.map((icon) => (
                            <option key={icon} value={icon}>{icon}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Display Order</label>
                    <input
                        type="number"
                        value={form.displayOrder}
                        onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Status</label>
                    <select
                        value={form.isActive ? "active" : "inactive"}
                        onChange={(e) => setForm({ ...form, isActive: e.target.value === "active" })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold focus:ring-4 focus:ring-primary/10 transition-all appearance-none"
                    >
                        <option value="active">Active (Visible)</option>
                        <option value="inactive">Inactive (Hidden)</option>
                    </select>
                </div>
            </div>
            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Saving..." : submitLabel}
                </button>
                <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex items-center gap-2 bg-slate-100 text-slate-600 px-8 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                    <X className="w-4 h-4" />
                    Cancel
                </button>
            </div>
        </form>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black font-playfair bg-linear-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                        Statistics
                    </h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium italic">
                        Manage the numbers shown on the Success Stories and Alumni pages
                    </p>
                </div>
                {!isAdding && !editingId && (
                    <button
                        onClick={() => { setIsAdding(true); setEditingId(null); setForm(DEFAULT_STAT); }}
                        className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl hover:bg-primary/90 transition-all font-bold shadow-xl shadow-primary/20 hover:-translate-y-1"
                    >
                        <Plus className="w-5 h-5" />
                        Add Stat
                    </button>
                )}
            </div>

            {/* Add Form */}
            {isAdding && (
                <div className="space-y-2">
                    <h2 className="text-lg font-black text-slate-700 uppercase tracking-widest">New Stat</h2>
                    <StatForm onSubmit={handleCreate} submitLabel="Create Stat" />
                </div>
            )}

            {/* Stats List */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array(5).fill(null).map((_, i) => (
                        <div key={i} className="bg-white rounded-3xl p-6 border border-slate-50 animate-pulse space-y-3">
                            <div className="h-5 bg-slate-100 rounded-full w-2/3" />
                            <div className="h-10 bg-slate-50 rounded-full w-1/2" />
                        </div>
                    ))}
                </div>
            ) : stats.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-4xl border border-slate-50">
                    <TrendingUp className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">No stats yet. Add your first one!</p>
                    <p className="text-slate-300 text-sm mt-1">Stats appear on the Success Stories and Alumni pages.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {stats.map((stat) => (
                        <div key={stat._id}>
                            {editingId === stat._id ? (
                                <div className="space-y-2">
                                    <h2 className="text-lg font-black text-slate-700 uppercase tracking-widest">Editing: {stat.label}</h2>
                                    <StatForm onSubmit={handleUpdate} submitLabel="Save Changes" />
                                </div>
                            ) : (
                                <div className={cn(
                                    "bg-white rounded-3xl p-6 border shadow-sm flex items-center justify-between gap-6 group hover:shadow-md transition-all",
                                    stat.isActive ? "border-slate-100" : "border-dashed border-slate-200 opacity-60"
                                )}>
                                    <div className="flex items-center gap-5">
                                        <div className="text-slate-200 group-hover:text-slate-300 transition-colors cursor-grab">
                                            <GripVertical className="w-5 h-5" />
                                        </div>
                                        <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary text-xl font-black">
                                            {stat.value}{stat.suffix}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-lg">{stat.label}</p>
                                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                                                Icon: {stat.icon} · Order: {stat.displayOrder} ·{" "}
                                                <span className={stat.isActive ? "text-emerald-500" : "text-slate-400"}>
                                                    {stat.isActive ? "Visible" : "Hidden"}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => startEdit(stat)}
                                            className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(stat._id!)}
                                            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Info box */}
            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 flex gap-4">
                <TrendingUp className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                    <p className="font-bold text-blue-800 text-sm">Where do these stats appear?</p>
                    <p className="text-blue-600 text-sm mt-1">
                        Stats are shown on the <strong>Success Stories</strong> page (as a dark banner strip) and the <strong>Alumni</strong> page.
                        Each school has its own set of stats. Use the school switcher in the header to manage stats per school.
                    </p>
                </div>
            </div>
        </div>
    );
}
