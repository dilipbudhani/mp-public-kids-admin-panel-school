"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Briefcase,
    MapPin,
    Search,
    CheckCircle2,
    XCircle,
    Building2,
    Users2,
    Clock,
    UserCircle,
    FileText,
    Mail,
    Phone,
    Download,
    ArrowUpRight
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Modal from "@/components/Modal";
import { motion, AnimatePresence } from "framer-motion";

interface Job {
    _id: string;
    title: string;
    department: string;
    category: 'Teaching' | 'Non-Teaching' | 'Admin';
    experience: string;
    qualification: string;
    type: 'Full-time' | 'Part-time';
    location: string;
    vacancies: number;
    isActive: boolean;
    displayOrder: number;
}

const CATEGORIES = ['Teaching', 'Non-Teaching', 'Admin'] as const;
const JOB_TYPES = ['Full-time', 'Part-time'] as const;

export default function CareersAdminPage() {
    const [items, setItems] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'openings' | 'applications'>('openings');
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const [formData, setFormData] = useState({
        title: "",
        department: "",
        category: 'Teaching' as 'Teaching' | 'Non-Teaching' | 'Admin',
        experience: "",
        qualification: "",
        type: 'Full-time' as 'Full-time' | 'Part-time',
        location: "MP Kids School Campus",
        vacancies: 1,
        isActive: true,
        displayOrder: 0
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/jobs");
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (error) {
            toast.error("Failed to fetch jobs");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (item?: Job) => {
        if (item) {
            setEditingId(item._id);
            setFormData({
                title: item.title,
                department: item.department,
                category: item.category,
                experience: item.experience,
                qualification: item.qualification,
                type: item.type,
                location: item.location,
                vacancies: item.vacancies,
                isActive: item.isActive,
                displayOrder: item.displayOrder
            });
        } else {
            setEditingId(null);
            setFormData({
                title: "",
                department: "",
                category: 'Teaching',
                experience: "",
                qualification: "",
                type: 'Full-time',
                location: "MP Kids School Campus",
                vacancies: 1,
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
            const url = editingId ? `/api/jobs/${editingId}` : "/api/jobs";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success(`Job ${editingId ? "updated" : "added"} successfully`);
                fetchJobs();
                setIsModalOpen(false);
            } else {
                toast.error("Failed to save job");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this job opening?")) return;

        try {
            const res = await fetch(`/api/jobs/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Job opening deleted");
                fetchJobs();
            } else {
                toast.error("Failed to delete job");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const toggleStatus = async (item: Job) => {
        try {
            const res = await fetch(`/api/jobs/${item._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...item, isActive: !item.isActive }),
            });

            if (res.ok) {
                toast.success("Status updated");
                fetchJobs();
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.department.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-playfair">Careers</h1>
                    <p className="text-gray-500">Manage current job openings and review candidate applications</p>
                </div>
                {activeTab === 'openings' && (
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20 self-start"
                    >
                        <Plus className="w-5 h-5" />
                        Add Opening
                    </button>
                )}
            </div>

            {/* TABS */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('openings')}
                    className={cn(
                        "px-6 py-3 font-bold text-sm transition-all border-b-2",
                        activeTab === 'openings' ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    )}
                >
                    Job Openings
                </button>
                <button
                    onClick={() => setActiveTab('applications')}
                    className={cn(
                        "px-6 py-3 font-bold text-sm transition-all border-b-2",
                        activeTab === 'applications' ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    )}
                >
                    Application Pool
                </button>
            </div>

            {activeTab === 'applications' ? (
                <ApplicationsList />
            ) : (
                <>
                    {/* Openings Render */}
                    <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-50 border-none rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary transition-all text-sm"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedCategory("All")}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                                    selectedCategory === "All" ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                )}
                            >
                                All
                            </button>
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                                        selectedCategory === cat ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-3xl h-24 animate-pulse border border-gray-100" />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Job Details</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Vacancies</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredItems.map((item) => (
                                            <tr key={item._id} className={cn("hover:bg-gray-50/50 transition-colors", !item.isActive && "opacity-60")}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                                            <Briefcase className="w-5 h-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900">{item.title}</div>
                                                            <div className="text-xs text-gray-500">{item.department}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                                                        {item.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4 text-gray-400" />
                                                        {item.type}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <Users2 className="w-4 h-4 text-gray-400" />
                                                        {item.vacancies}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => toggleStatus(item)}
                                                        className={cn(
                                                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all",
                                                            item.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                                                        )}
                                                    >
                                                        <span className={cn("w-1.5 h-1.5 rounded-full", item.isActive ? "bg-green-600" : "bg-gray-400")} />
                                                        {item.isActive ? "Active" : "Paused"}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleOpenModal(item)}
                                                            className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-all"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item._id)}
                                                            className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-all"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredItems.length === 0 && (
                                    <div className="p-12 text-center text-gray-500">
                                        No job openings found
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? "Edit Opening" : "Add New Opening"}
            >
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Job Title</label>
                            <input
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
                                placeholder="e.g. Senior PGT Teacher"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Department</label>
                            <input
                                required
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
                                placeholder="e.g. Sciences / Admin"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Employment Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
                            >
                                {JOB_TYPES.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Experience Required</label>
                            <input
                                required
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
                                placeholder="e.g. 3-5 Years"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Qualification</label>
                            <input
                                required
                                value={formData.qualification}
                                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
                                placeholder="e.g. M.Sc, B.Ed"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location</label>
                            <input
                                required
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Vacancies</label>
                            <input
                                required
                                type="number"
                                value={formData.vacancies}
                                onChange={(e) => setFormData({ ...formData, vacancies: parseInt(e.target.value) })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
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
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <label htmlFor="isActive" className="text-sm font-bold text-gray-500 uppercase tracking-wider cursor-pointer">Post Live</label>
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
                            {isSaving ? "Saving..." : "Save Opening"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

function ApplicationsList() {
    const [apps, setApps] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/leads?enquiryType=Career");
            if (res.ok) {
                const data = await res.json();
                setApps(data);
            }
        } catch (error) {
            toast.error("Failed to fetch applications");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this application?")) return;
        try {
            await fetch(`/api/leads/${id}`, { method: "DELETE" });
            fetchApplications();
        } catch (error) {
            toast.error("Cleanup failed");
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2].map(i => <div key={i} className="bg-white rounded-3xl h-24 animate-pulse border border-gray-100" />)}
            </div>
        );
    }

    if (apps.length === 0) {
        return (
            <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="w-10 h-10 text-gray-200" />
                </div>
                <p className="text-gray-400 font-bold italic">No candidates have applied yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-50 bg-gray-50/50">
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Applicant Info</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Submission Details</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {apps.map((app) => (
                            <tr key={app._id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-6 w-1/3 align-top">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-500 uppercase">
                                            {app.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{app.name}</div>
                                            <div className="text-xs text-gray-500 font-medium flex flex-col gap-1 mt-1">
                                                <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {app.email}</span>
                                                <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {app.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6 align-top">
                                    <div className="text-gray-600 text-xs font-medium leading-relaxed max-w-sm whitespace-pre-wrap bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        {app.message.split('Resume URL: ')[0]}
                                    </div>
                                    <div className="mt-3 flex items-center justify-between gap-2">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-2.5 py-1 rounded-md">
                                            Applied {new Date(app.createdAt).toLocaleDateString()}
                                        </span>
                                        {app.message.includes('Resume URL: ') && (
                                            <a
                                                href={app.message.split('Resume URL: ')[1].trim()}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-bold rounded-lg transition-all"
                                            >
                                                <Download className="w-3.5 h-3.5" />
                                                View Resume
                                            </a>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-6 text-right align-top">
                                    <button
                                        onClick={() => handleDelete(app._id)}
                                        className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all shadow-sm"
                                        title="Delete Application"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
