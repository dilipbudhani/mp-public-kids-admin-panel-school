"use client";

import React, { useState, useEffect } from "react";
import {
    Search,
    Mail,
    Phone,
    User,
    Calendar,
    Filter,
    MoreVertical,
    Trash2,
    CheckCircle2,
    Clock,
    XCircle,
    GraduationCap,
    Info,
    ArrowUpRight
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Lead {
    _id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    source?: string;
    sourcePage?: string;
    status: 'New' | 'Contacted' | 'Converted' | 'Closed';
    createdAt: string;
}

const STATUS_CONFIG = {
    New: { color: 'text-blue-500', bg: 'bg-blue-50', icon: Clock },
    Contacted: { color: 'text-amber-500', bg: 'bg-amber-50', icon: Info },
    Converted: { color: 'text-emerald-500', bg: 'bg-emerald-50', icon: CheckCircle2 },
    Closed: { color: 'text-slate-500', bg: 'bg-slate-50', icon: XCircle },
};

export default function LeadsAdminPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/leads?excludeType=Career");
            if (res.ok) {
                const data = await res.json();
                setLeads(data);
            }
        } catch (error) {
            toast.error("Failed to fetch leads");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/leads/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            if (res.ok) {
                toast.success("Status updated");
                fetchLeads();
            }
        } catch (error) {
            toast.error("Update failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Lead record removed");
                fetchLeads();
            }
        } catch (error) {
            toast.error("Deletion failed");
        }
    };

    const filteredLeads = leads.filter(l => {
        const matchesSearch =
            l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.phone.includes(searchTerm);
        const matchesStatus = statusFilter === "All" || l.status === statusFilter;

        // Date range filtering
        const leadDate = new Date(l.createdAt);
        const matchesStartDate = !startDate || leadDate >= new Date(startDate);
        const matchesEndDate = !endDate || leadDate <= new Date(new Date(endDate).setHours(23, 59, 59, 999));

        return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
    });

    const stats = {
        total: leads.length,
        new: leads.filter(l => l.status === 'New').length,
        contacted: leads.filter(l => l.status === 'Contacted').length,
        converted: leads.filter(l => l.status === 'Converted').length,
    };

    return (
        <div className="space-y-10 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black font-playfair bg-linear-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">Lead Management</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium italic">Manage admissions inquiries and contact form submissions</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Enquiries', value: stats.total, color: 'text-slate-900', bg: 'bg-white', icon: Mail },
                    { label: 'New Inbox', value: stats.new, color: 'text-blue-600', bg: 'bg-blue-50/50', icon: Clock },
                    { label: 'In Progress', value: stats.contacted, color: 'text-amber-600', bg: 'bg-amber-50/50', icon: Info },
                    { label: 'Success Rate', value: `${stats.total ? Math.round((stats.converted / stats.total) * 100) : 0}%`, color: 'text-emerald-600', bg: 'bg-emerald-50/50', icon: GraduationCap },
                ].map((stat, i) => (
                    <div key={i} className={cn("p-8 rounded-5xl border border-slate-50 shadow-sm flex items-center justify-between", stat.bg)}>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                            <p className={cn("text-3xl font-black", stat.color)}>{stat.value}</p>
                        </div>
                        <div className={cn("p-4 rounded-2xl bg-white shadow-sm", stat.color)}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col xl:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Filter by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-6 py-5 focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm text-lg font-medium"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-4xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 pl-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Range</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-primary/20"
                        />
                        <span className="text-slate-300">to</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    {(startDate || endDate) && (
                        <button
                            onClick={() => { setStartDate(""); setEndDate(""); }}
                            className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 px-2"
                        >
                            Reset
                        </button>
                    )}
                    <div className="h-8 w-px bg-slate-100 mx-2 hidden xl:block" />
                    <div className="flex gap-2">
                        {['All', 'New', 'Contacted', 'Converted', 'Closed'].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={cn(
                                    "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    statusFilter === status ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                )}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-5xl border border-slate-50 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/50">
                                <th className="px-8 py-6 font-black uppercase tracking-widest text-slate-400 text-[10px]">Lead Info</th>
                                <th className="px-8 py-6 font-black uppercase tracking-widest text-slate-400 text-[10px]">Inquiry Details</th>
                                <th className="px-8 py-6 font-black uppercase tracking-widest text-slate-400 text-[10px]">Source</th>
                                <th className="px-8 py-6 font-black uppercase tracking-widest text-slate-400 text-[10px]">Status</th>
                                <th className="px-8 py-6 font-black uppercase tracking-widest text-slate-400 text-[10px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                Array(5).fill(null).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-8 py-10"><div className="h-4 bg-slate-100 rounded w-full" /></td>
                                    </tr>
                                ))
                            ) : filteredLeads.map((lead) => {
                                const StatusIcon = STATUS_CONFIG[lead.status].icon;
                                return (
                                    <tr key={lead._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 text-lg">
                                                    {lead.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-black text-slate-900 text-lg leading-tight">{lead.name}</div>
                                                    <div className="text-slate-400 text-sm font-medium flex items-center gap-1.5 mt-0.5">
                                                        <Mail className="w-3 h-3" />
                                                        {lead.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-1.5 text-slate-900 font-bold mb-1.5">
                                                <Phone className="w-4 h-4 text-slate-300" />
                                                {lead.phone}
                                            </div>
                                            <div className="text-slate-500 text-xs font-medium max-w-xs leading-relaxed whitespace-pre-wrap mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                {lead.message}
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{new Date(lead.createdAt).toLocaleDateString()}</span>
                                                <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5 capitalize">
                                                    <ArrowUpRight className="w-3 h-3 text-slate-400" />
                                                    {(lead.source || lead.sourcePage || 'unknown').replace('-', ' ')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-center sm:text-left">
                                            <div className="relative inline-block group/status">
                                                <button
                                                    className={cn(
                                                        "flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all",
                                                        STATUS_CONFIG[lead.status].bg,
                                                        STATUS_CONFIG[lead.status].color
                                                    )}
                                                >
                                                    <StatusIcon className="w-3.5 h-3.5" />
                                                    {lead.status}
                                                </button>

                                                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all z-10 p-2">
                                                    {(['New', 'Contacted', 'Converted', 'Closed'] as const).map(s => (
                                                        <button
                                                            key={s}
                                                            onClick={() => handleUpdateStatus(lead._id, s)}
                                                            className={cn(
                                                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left",
                                                                lead.status === s ? "bg-slate-50 text-slate-900" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                                                            )}
                                                        >
                                                            <div className={cn("w-2 h-2 rounded-full", (STATUS_CONFIG[s] as { color: string }).color.replace('text', 'bg'))} />
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-right">
                                            <button
                                                onClick={() => handleDelete(lead._id)}
                                                className="p-3 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {filteredLeads.length === 0 && !isLoading && (
                    <div className="py-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                            <Mail className="w-10 h-10 text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-bold italic">No leads found matching your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
