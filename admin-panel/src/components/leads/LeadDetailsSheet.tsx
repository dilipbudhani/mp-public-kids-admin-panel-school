"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Mail,
    Phone,
    Calendar,
    User,
    FileText,
    Tag,
    Clock,
    ChevronRight,
    Loader2,
    Save,
    Trash2,
    MessageSquare
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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

interface LeadDetailsSheetProps {
    lead: Lead;
    onClose: () => void;
    onUpdate: (updatedLead: Lead) => void;
}

export function LeadDetailsSheet({ lead, onClose, onUpdate }: LeadDetailsSheetProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [status, setStatus] = useState(lead.status);
    const [priority, setPriority] = useState(lead.priority);
    const [adminNotes, setAdminNotes] = useState(lead.adminNotes || "");

    const handleUpdate = async () => {
        setIsSaving(true);
        try {
            const response = await fetch(`/api/leads/${lead.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status,
                    priority,
                    adminNotes,
                }),
            });

            if (!response.ok) throw new Error("Failed up update lead");

            const updatedLead = await response.json();
            onUpdate(updatedLead);
            onClose();
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update lead.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this lead?")) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/leads/${lead.id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete lead");

            // For now just close, the parent should ideally remove it from list
            window.location.reload(); // Simple way to refresh list
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete lead.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-xl bg-white shadow-2xl flex flex-col h-full"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 font-playfair">Lead Details</h2>
                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">ID: {lead.id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Basic Info */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-gray-400">
                            <User className="w-4 h-4" />
                            <h3 className="text-xs font-bold uppercase tracking-widest">Leads Contact Info</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 group">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</p>
                                <p className="text-sm font-semibold text-gray-900">{lead.name}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Enquiry Type</p>
                                <p className="text-sm font-semibold text-gray-900">{lead.enquiryType}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email</p>
                                    <p className="text-sm font-semibold text-gray-900">{lead.email}</p>
                                </div>
                                <a href={`mailto:${lead.email}`} className="p-2 hover:bg-white rounded-lg text-primary transition-all">
                                    <Mail className="w-4 h-4" />
                                </a>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone</p>
                                    <p className="text-sm font-semibold text-gray-900">{lead.phone}</p>
                                </div>
                                <a href={`tel:${lead.phone}`} className="p-2 hover:bg-white rounded-lg text-emerald-600 transition-all">
                                    <Phone className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* Message Body */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-gray-400">
                            <MessageSquare className="w-4 h-4" />
                            <h3 className="text-xs font-bold uppercase tracking-widest">Initial Message</h3>
                        </div>
                        <div className="p-5 rounded-2xl bg-[#002147]/5 border border-[#002147]/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <MessageSquare className="w-12 h-12" />
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed italic">"{lead.message}"</p>
                        </div>
                    </section>

                    {/* Management Actions */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-gray-400">
                            <Tag className="w-4 h-4" />
                            <h3 className="text-xs font-bold uppercase tracking-widest">Management</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Current Status</label>
                                <select
                                    className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/10 transition-all font-medium"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="new">New Enquriy</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="qualified">Qualified</option>
                                    <option value="converted">Converted</option>
                                    <option value="lost">Lost</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Priority Level</label>
                                <select
                                    className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/10 transition-all font-medium"
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                >
                                    <option value="low">Low Priority</option>
                                    <option value="medium">Medium Priority</option>
                                    <option value="high">High Priority</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Admin Notes (Internal)</label>
                            <textarea
                                className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/10 transition-all resize-none h-32"
                                placeholder="Add follow-up notes, discussion summary etc..."
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                            />
                        </div>
                    </section>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-4">
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                        title="Delete Lead"
                    >
                        {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                    </button>

                    <button
                        onClick={handleUpdate}
                        disabled={isSaving}
                        className="flex-1 bg-[#002147] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#003366] transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                    >
                        {isSaving ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
export default LeadDetailsSheet;
