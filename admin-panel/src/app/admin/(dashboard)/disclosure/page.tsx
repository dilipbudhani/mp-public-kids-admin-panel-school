"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    ShieldCheck,
    Search,
    FileText,
    Link as LinkIcon,
    Table as TableIcon,
    GraduationCap,
    Users,
    Building2,
    CreditCard,
    ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Modal from "@/components/Modal";
import { motion, AnimatePresence } from "framer-motion";

interface DisclosureEntry {
    _id: string;
    section: 'GENERAL' | 'DOCUMENTS' | 'RESULT_10' | 'RESULT_12' | 'STAFF' | 'INFRASTRUCTURE' | 'FEE';
    label: string;
    value: string;
    value2?: string;
    value3?: string;
    value4?: string;
    link?: string;
    order: number;
}

const SECTIONS = [
    { id: 'GENERAL', label: 'General Info', icon: TableIcon },
    { id: 'DOCUMENTS', label: 'Documents', icon: FileText },
    { id: 'RESULT_10', label: 'Result Class X', icon: GraduationCap },
    { id: 'RESULT_12', label: 'Result Class XII', icon: GraduationCap },
    { id: 'STAFF', label: 'Staff Details', icon: Users },
    { id: 'INFRASTRUCTURE', label: 'Infrastructure', icon: Building2 },
    { id: 'FEE', label: 'Fee Structure', icon: CreditCard },
];

export default function DisclosureAdminPage() {
    const [disclosures, setDisclosures] = useState<DisclosureEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<DisclosureEntry['section']>('GENERAL');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [form, setForm] = useState({
        section: 'GENERAL' as DisclosureEntry['section'],
        label: "",
        value: "",
        value2: "",
        value3: "",
        value4: "",
        link: "",
        order: 0
    });

    useEffect(() => {
        fetchDisclosures();
    }, []);

    const fetchDisclosures = async () => {
        setIsLoading(true);
        try {
            const schoolId = typeof window !== 'undefined' ? localStorage.getItem("selectedSchool") : null;
            const res = await fetch(`/api/disclosure${schoolId ? `?schoolId=${schoolId}` : ""}`);
            if (res.ok) {
                const data = await res.json();
                setDisclosures(data);
            }
        } catch (error) {
            toast.error("Failed to fetch disclosure entries");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (entry?: DisclosureEntry) => {
        if (entry) {
            setEditingId(entry._id);
            setForm({
                section: entry.section,
                label: entry.label,
                value: entry.value,
                value2: entry.value2 || "",
                value3: entry.value3 || "",
                value4: entry.value4 || "",
                link: entry.link || "",
                order: entry.order
            });
        } else {
            setEditingId(null);
            setForm({
                section: activeSection,
                label: "",
                value: "",
                value2: "",
                value3: "",
                value4: "",
                link: "",
                order: disclosures.filter(d => d.section === activeSection).length
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const method = editingId ? "PUT" : "POST";
            const url = editingId ? `/api/disclosure/${editingId}` : "/api/disclosure";

            const schoolId = typeof window !== 'undefined' ? localStorage.getItem("selectedSchool") : null;
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    ...(schoolId && { "x-school-id": schoolId })
                },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                toast.success(`Entry ${editingId ? 'updated' : 'created'} successfully`);
                fetchDisclosures();
                setIsModalOpen(false);
            } else {
                toast.error("Failed to save entry");
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
            const res = await fetch(`/api/disclosure/${id}`, {
                method: "DELETE",
                headers: {
                    ...(schoolId && { "x-school-id": schoolId })
                }
            });
            if (res.ok) {
                toast.success("Entry deleted");
                fetchDisclosures();
            } else {
                toast.error("Failed to delete entry");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const activeEntries = disclosures
        .filter(d => d.section === activeSection)
        .sort((a, b) => a.order - b.order);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black font-playfair bg-linear-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent italic">CBSE Disclosure</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium italic">Manage mandatory public disclosure data for school compliance</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl hover:bg-primary/90 transition-all font-bold shadow-xl shadow-primary/20 hover:-translate-y-1"
                >
                    <Plus className="w-5 h-5" />
                    Add Entry
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 shrink-0 space-y-2">
                    {SECTIONS.map((section) => {
                        const Icon = section.icon;
                        return (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id as any)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold text-sm",
                                    activeSection === section.id
                                        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                                        : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {section.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white rounded-5xl border border-slate-100 shadow-sm overflow-hidden min-h-[600px]">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black font-playfair text-slate-900">
                                    {SECTIONS.find(s => s.id === activeSection)?.label}
                                </h2>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Listing {activeEntries.length} Records</p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {isLoading ? (
                            <div className="p-12 space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-16 w-full bg-slate-50 rounded-2xl animate-pulse" />
                                ))}
                            </div>
                        ) : activeEntries.length > 0 ? (
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Order</th>
                                        <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Information / Label</th>
                                        <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Details / Status</th>
                                        {(activeSection === 'RESULT_10' || activeSection === 'RESULT_12') && (
                                            <>
                                                <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Passed</th>
                                                <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Pass %</th>
                                            </>
                                        )}
                                        <th className="px-8 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    <AnimatePresence mode="popLayout">
                                        {activeEntries.map((entry) => (
                                            <motion.tr
                                                key={entry._id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="hover:bg-slate-50/10 transition-colors group"
                                            >
                                                <td className="px-8 py-4 text-sm font-bold text-slate-400">{entry.order}</td>
                                                <td className="px-8 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-slate-900">{entry.label}</span>
                                                        {entry.link && (
                                                            <a href={entry.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-blue-500 font-bold hover:underline mt-1">
                                                                <ExternalLink className="w-3 h-3" /> View Source
                                                            </a>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <span className={cn(
                                                        "text-sm font-bold",
                                                        entry.value === 'Available' ? "text-green-600" : "text-slate-600"
                                                    )}>{entry.value}</span>
                                                </td>
                                                {(activeSection === 'RESULT_10' || activeSection === 'RESULT_12') && (
                                                    <>
                                                        <td className="px-8 py-4 text-sm font-bold text-slate-600">{entry.value3}</td>
                                                        <td className="px-8 py-4 text-sm font-black text-primary">{entry.value4}</td>
                                                    </>
                                                )}
                                                <td className="px-8 py-4 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleOpenModal(entry)} className="p-2 bg-slate-50 text-slate-400 hover:bg-primary hover:text-white rounded-lg transition-all">
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDelete(entry._id)} className="p-2 bg-red-50 text-red-300 hover:bg-red-500 hover:text-white rounded-lg transition-all">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-20 text-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <TableIcon className="w-10 h-10 text-slate-200" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900">No records found</h3>
                                <p className="text-sm text-slate-400 mt-1">Start by adding your first entry to this section.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? "Edit Entry" : "Add New Entry"}
            >
                <form onSubmit={handleSave} className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Section</label>
                            <select
                                value={form.section}
                                onChange={(e) => {
                                    const newSection = e.target.value as any;
                                    setForm({ ...form, section: newSection, order: disclosures.filter(d => d.section === newSection).length });
                                }}
                                className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-bold h-[62px]"
                            >
                                {SECTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Display Order</label>
                            <input
                                required
                                type="number"
                                value={form.order}
                                onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) })}
                                className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-bold h-[62px]"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                            {(activeSection === 'RESULT_10' || activeSection === 'RESULT_12') ? 'Academic Year' : 'Information Label'}
                        </label>
                        <input
                            required
                            type="text"
                            value={form.label}
                            onChange={(e) => setForm({ ...form, label: e.target.value })}
                            className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                            placeholder={(activeSection === 'RESULT_10' || activeSection === 'RESULT_12') ? 'e.g. 2023-24' : 'e.g. SCHOOL NAME'}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={cn(
                            "space-y-2",
                            (activeSection === 'RESULT_10' || activeSection === 'RESULT_12') ? "col-span-1" : "col-span-2"
                        )}>
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                {(activeSection === 'RESULT_10' || activeSection === 'RESULT_12') ? 'Registered Students' : 'Details / Value'}
                            </label>
                            <input
                                required
                                type="text"
                                value={form.value}
                                onChange={(e) => setForm({ ...form, value: e.target.value })}
                                className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                                placeholder="e.g. Available / 150 / ₹ 25,000"
                            />
                        </div>

                        {(activeSection === 'RESULT_10' || activeSection === 'RESULT_12') && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Passed Students</label>
                                    <input
                                        required
                                        type="text"
                                        value={form.value3}
                                        onChange={(e) => setForm({ ...form, value3: e.target.value })}
                                        className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                                        placeholder="e.g. 148"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Pass Percentage (%)</label>
                                    <input
                                        required
                                        type="text"
                                        value={form.value4}
                                        onChange={(e) => setForm({ ...form, value4: e.target.value })}
                                        className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                                        placeholder="e.g. 98.6%"
                                    />
                                </div>
                            </>
                        )}

                        {activeSection === 'DOCUMENTS' && (
                            <div className="col-span-2 space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Document Link (URL)</label>
                                <input
                                    type="text"
                                    value={form.link}
                                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                                    className="w-full bg-slate-50 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                                    placeholder="https://example.com/document.pdf"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-white border-2 border-slate-100 text-slate-400 font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-slate-50 transition-all">Discard</button>
                        <button type="submit" disabled={isSaving} className="flex-2 bg-primary text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">{isSaving ? "Saving..." : (editingId ? "Update Entry" : "Create Entry")}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
