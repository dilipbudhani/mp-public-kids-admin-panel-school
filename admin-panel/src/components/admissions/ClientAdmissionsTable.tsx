'use client';

import React, { useState } from 'react';
import {
    Search,
    Filter,
    MoreVertical,
    Eye,
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
    FileText,
    Calendar,
    ChevronRight,
    ChevronLeft,
    X,
    Settings,
    Upload,
    UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Admission {
    id: string;
    applicationNo: string;
    studentName: string;
    applyingForClass: string;
    academicYear: string;
    status: "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED" | "WAITLISTED";
    createdAt: string;
    email: string;
    primaryContact: string;
    adminNotes?: string;
    fatherName: string;
    motherName: string;
    documents?: {
        type: string;
        url: string;
        publicId: string;
        uploadedAt: string;
    }[];
}

const statusConfig = {
    PENDING: { color: "text-amber-500", bg: "bg-amber-50", icon: Clock },
    REVIEWING: { color: "text-blue-500", bg: "bg-blue-50", icon: Search },
    APPROVED: { color: "text-emerald-500", bg: "bg-emerald-50", icon: CheckCircle2 },
    REJECTED: { color: "text-rose-500", bg: "bg-rose-50", icon: XCircle },
    WAITLISTED: { color: "text-indigo-500", bg: "bg-indigo-50", icon: AlertCircle },
};

export function ClientAdmissionsTable({ initialAdmissions }: { initialAdmissions: Admission[] }) {
    const [admissions, setAdmissions] = useState(initialAdmissions);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [adminNotes, setAdminNotes] = useState('');
    const [newStatus, setNewStatus] = useState<string>('');
    const [isConverting, setIsConverting] = useState(false);

    const filteredAdmissions = admissions.filter(adm => {
        const matchesSearch = adm.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            adm.applicationNo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || adm.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const handleUpdateStatus = async () => {
        if (!selectedAdmission || !newStatus) return;

        setIsUpdating(true);
        try {
            const res = await fetch(`/api/admissions/${selectedAdmission.id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, adminNotes })
            });

            if (!res.ok) throw new Error('Failed to update status');

            const updated = await res.json();
            setAdmissions(prev => prev.map(a => a.id === updated.id ? updated : a));
            setSelectedAdmission(updated);
            toast.success('Status updated successfully');
        } catch (error) {
            toast.error('Error updating status');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCreateStudentRecord = async () => {
        if (!selectedAdmission) return;

        setIsConverting(true);
        try {
            const res = await fetch('/api/students/convert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ admissionId: selectedAdmission.id })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create student record');

            toast.success(`Success! Student ID: ${data.studentId}`);
            // In a real app, we might want to refresh the list or redirect
            setSelectedAdmission(null);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsConverting(false);
        }
    };

    const openPanel = (adm: Admission) => {
        setSelectedAdmission(adm);
        setAdminNotes(adm.adminNotes || '');
        setNewStatus(adm.status);
    };

    return (
        <div className="relative">
            {/* Filters & Actions */}
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-white">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or application no..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 overflow-x-auto scrollbar-hide">
                        <Filter className="h-4 w-4 text-gray-400 shrink-0" />
                        {['all', 'PENDING', 'REVIEWING', 'APPROVED', 'REJECTED', 'WAITLISTED'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilterStatus(s)}
                                className={cn(
                                    "text-xs font-medium px-3 py-1 rounded-lg transition-all whitespace-nowrap",
                                    filterStatus === s
                                        ? "bg-white text-primary shadow-sm ring-1 ring-gray-200"
                                        : "text-gray-500 hover:text-gray-900"
                                )}
                            >
                                {s === 'all' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Application</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Class</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredAdmissions.map((adm) => {
                            const Config = statusConfig[adm.status];
                            return (
                                <tr key={adm.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded-lg border border-primary/10">
                                            {adm.applicationNo}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-gray-900">{adm.studentName}</div>
                                        <div className="text-xs text-gray-500">{adm.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-600 font-medium">{adm.applyingForClass}</div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{adm.academicYear}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border",
                                            Config.bg, Config.color, "border-current/10"
                                        )}>
                                            <Config.icon className="h-3 w-3" />
                                            {adm.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-600">{new Date(adm.createdAt).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => openPanel(adm)}
                                            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all text-gray-400 hover:text-primary shadow-none hover:shadow-sm"
                                        >
                                            <Eye className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredAdmissions.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
                            <Search className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No applications found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                    </div>
                )}
            </div>

            {/* Side Panel for Management */}
            <AnimatePresence>
                {selectedAdmission && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedAdmission(null)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 mt-18 md:ml-64"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="fixed top-0 right-0 w-full max-w-lg h-full bg-white shadow-2xl z-60 flex flex-col mt-18 md:ml-64"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
                                <h3 className="text-xl font-bold text-gray-900 font-playfair">Application Details</h3>
                                <button
                                    onClick={() => setSelectedAdmission(null)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="h-5 w-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                                {/* Header Info */}
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <FileText className="h-8 w-8 text-primary" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-bold tracking-widest text-primary uppercase">Application</span>
                                            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono font-bold">{selectedAdmission.applicationNo}</span>
                                        </div>
                                        <h4 className="text-2xl font-bold text-gray-900">{selectedAdmission.studentName}</h4>
                                    </div>
                                </div>

                                {/* Quick Stats Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Applying For</p>
                                        <p className="font-bold text-gray-900">{selectedAdmission.applyingForClass}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Session</p>
                                        <p className="font-bold text-gray-900">{selectedAdmission.academicYear}</p>
                                    </div>
                                </div>

                                {/* Detailed Info */}
                                <div className="space-y-4">
                                    <h5 className="text-sm font-bold text-gray-900 border-b pb-2">Parent Information</h5>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Father's Name</p>
                                            <p className="font-medium">{selectedAdmission.fatherName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Mother's Name</p>
                                            <p className="font-medium">{selectedAdmission.motherName}</p>
                                        </div>
                                        <div className="flex gap-8">
                                            <div>
                                                <p className="text-xs text-gray-500">Primary Contact</p>
                                                <p className="font-medium text-primary">{selectedAdmission.primaryContact}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Email Address</p>
                                                <p className="font-medium">{selectedAdmission.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Documents Section */}
                                <div className="space-y-4">
                                    <h5 className="text-sm font-bold text-gray-900 border-b pb-2 flex items-center justify-between">
                                        Uploaded Documents
                                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                                            {selectedAdmission.documents?.length || 0} Files
                                        </span>
                                    </h5>
                                    <div className="grid grid-cols-1 gap-3">
                                        {selectedAdmission.documents && selectedAdmission.documents.length > 0 ? (
                                            selectedAdmission.documents.map((doc, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-primary/20 hover:shadow-sm transition-all group">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center text-primary group-hover:bg-primary/5 transition-colors">
                                                            <FileText size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900 capitalize">{doc.type.replace(/_/g, ' ')}</p>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                                                                Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <a
                                                        href={doc.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                                        title="View Document"
                                                    >
                                                        <Eye size={18} />
                                                    </a>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <Upload size={20} className="text-gray-300" />
                                                </div>
                                                <p className="text-sm text-gray-500 font-medium">No documents uploaded</p>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">Status: Pending Verification</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Status Update Form */}
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                    <h5 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Settings className="h-4 w-4" />
                                        Updates & Management
                                    </h5>

                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Update Status</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED', 'WAITLISTED'].map((s) => (
                                                    <button
                                                        key={s}
                                                        onClick={() => setNewStatus(s)}
                                                        className={cn(
                                                            "text-xs font-bold py-2 px-3 rounded-lg border transition-all text-center",
                                                            newStatus === s
                                                                ? "bg-primary border-primary text-white"
                                                                : "bg-white border-slate-200 text-slate-600 hover:border-primary/50"
                                                        )}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="notes" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Admin Remarks (Internal + Student View)</label>
                                            <textarea
                                                id="notes"
                                                rows={4}
                                                value={adminNotes}
                                                onChange={(e) => setAdminNotes(e.target.value)}
                                                placeholder="Add notes about documents, interview results, etc..."
                                                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none resize-none"
                                            />
                                        </div>

                                        <button
                                            onClick={handleUpdateStatus}
                                            disabled={isUpdating}
                                            className="w-full bg-slate-900 hover:bg-black text-white py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isUpdating ? <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>

                                {selectedAdmission.status === 'APPROVED' && (
                                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 mb-6">
                                        <div className="flex items-center gap-3 text-emerald-700 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                                                <UserPlus className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h5 className="font-bold">Generate Student Record</h5>
                                                <p className="text-xs opacity-80 font-medium">Create a permanent record in the Student Data Management module.</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleCreateStudentRecord}
                                            disabled={isConverting}
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {isConverting ? <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Confirm Admission & Create Record'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
