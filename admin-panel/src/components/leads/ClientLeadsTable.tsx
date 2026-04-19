"use client";

import React, { useState } from "react";
import {
    Search,
    Filter,
    MoreVertical,
    ExternalLink,
    Eye,
    MessageSquare,
    Phone,
    Mail,
    Calendar,
    ChevronDown,
    Inbox
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { LeadDetailsSheet } from "./LeadDetailsSheet";

interface Lead {
    id: string;
    createdAt: string;
    name: string;
    email: string;
    phone: string;
    enquiryType: string;
    message: string;
    status: string;
    priority: string;
    adminNotes?: string | null;
    source: string;
}

export function ClientLeadsTable({ initialLeads }: { initialLeads: Lead[] }) {
    const [leads, setLeads] = useState(initialLeads);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    const filteredLeads = leads.filter(lead => {
        const matchesSearch =
            lead.name.toLowerCase().includes(search.toLowerCase()) ||
            lead.email.toLowerCase().includes(search.toLowerCase()) ||
            lead.phone.includes(search);

        const matchesStatus = statusFilter === "all" || lead.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "new": return "bg-blue-50 text-blue-600 border-blue-100";
            case "contacted": return "bg-amber-50 text-amber-600 border-amber-100";
            case "qualified": return "bg-indigo-50 text-indigo-600 border-indigo-100";
            case "converted": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "lost": return "bg-gray-50 text-gray-600 border-gray-100";
            default: return "bg-gray-50 text-gray-600";
        }
    };

    const getPriorityStyle = (priority: string) => {
        switch (priority) {
            case "high": return "text-red-600";
            case "medium": return "text-amber-600";
            case "low": return "text-blue-600";
            default: return "text-gray-600";
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Toolbar */}
            <div className="p-4 lg:p-6 border-b border-gray-50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search leads by name, email or phone..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <select
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 shadow-sm cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/30">
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Lead Info</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Enquiry</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Priority</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredLeads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-900">{lead.name}</span>
                                        <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                            <Mail className="w-3 h-3" /> {lead.email}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-700">{lead.enquiryType}</span>
                                        <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5 whitespace-nowrap">
                                            <Calendar className="w-3 h-3" /> {format(new Date(lead.createdAt), 'MMM d, h:mm b')}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-full text-xs font-bold border",
                                        getStatusStyle(lead.status)
                                    )}>
                                        {lead.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5">
                                        <div className={cn("w-1.5 h-1.5 rounded-full bg-current", getPriorityStyle(lead.priority))} />
                                        <span className={cn("text-xs font-semibold capitalize", getPriorityStyle(lead.priority))}>
                                            {lead.priority}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => setSelectedLead(lead)}
                                        className="inline-flex items-center justify-center p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 transition-all"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredLeads.length === 0 && (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Inbox className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No leads found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </div>

            {/* Details Panel */}
            {selectedLead && (
                <LeadDetailsSheet
                    lead={selectedLead}
                    onClose={() => setSelectedLead(null)}
                    onUpdate={(updatedLead) => {
                        setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
                    }}
                />
            )}
        </div>
    );
}
