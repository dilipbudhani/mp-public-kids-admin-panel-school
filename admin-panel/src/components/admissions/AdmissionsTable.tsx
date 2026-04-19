"use client";

import React, { useState } from 'react';
import {
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    FileText,
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
    Download,
    Mail
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { AdmissionDetailsSheet } from './AdmissionDetailsSheet';

interface Admission {
    _id: string;
    applicationNo: string;
    studentName: string;
    dateOfBirth: string;
    gender: string;
    applyingForClass: string;
    academicYear: string;
    fatherName: string;
    motherName: string;
    primaryContact: string;
    alternateContact?: string;
    email: string;
    address: string;
    city: string;
    pincode: string;
    previousSchool?: string;
    previousClass?: string;
    previousStream?: string;
    transferCertificate?: boolean;
    status: string;
    paymentStatus: string;
    adminNotes?: string;
    reviewedAt?: string;
    documents?: any[];
    createdAt: string;
}

export function AdmissionsTable({ initialData }: { initialData: Admission[] }) {
    const [data, setData] = useState(initialData);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);

    const filteredData = data.filter(item => {
        const matchesSearch = item.studentName.toLowerCase().includes(search.toLowerCase()) ||
            item.applicationNo.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                        <CheckCircle2 className="w-3 h-3" /> Approved
                    </span>
                );
            case 'REJECTED':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                        <XCircle className="w-3 h-3" /> Rejected
                    </span>
                );
            case 'WAITLISTED':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                        <Clock className="w-3 h-3" /> Waitlisted
                    </span>
                );
            case 'REVIEWING':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        <Clock className="w-3 h-3" /> Reviewing
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                        <Clock className="w-3 h-3" /> Pending
                    </span>
                );
        }
    };

    return (
        <div className="w-full">
            <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/50">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or application no..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        className="bg-white border border-gray-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="REVIEWING">Reviewing</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="WAITLISTED">Waitlisted</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 font-semibold text-gray-600">Application No</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Student Name</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Class</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Date Applied</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredData.map((item) => (
                            <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4 font-medium text-primary">{item.applicationNo}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">{item.studentName}</span>
                                        <span className="text-xs text-gray-500">{item.primaryContact}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-600">
                                        Class {item.applyingForClass}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {format(new Date(item.createdAt), 'MMM dd, yyyy')}
                                </td>
                                <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => setSelectedAdmission(item)}
                                            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-primary transition-all"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-blue-600 transition-all"
                                            title="Send Email"
                                        >
                                            <Mail className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-red-600 transition-all"
                                            title="Delete"
                                        >
                                            <XCircle className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredData.length === 0 && (
                <div className="p-12 text-center">
                    <div className="inline-flex p-4 rounded-full bg-gray-50 mb-4">
                        <AlertCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">No admission applications found matching your filters.</p>
                </div>
            )}

            <AdmissionDetailsSheet
                admission={selectedAdmission}
                isOpen={!!selectedAdmission}
                onClose={() => setSelectedAdmission(null)}
                onUpdate={(updated) => {
                    setData(prev => prev.map(item => item._id === updated._id ? updated : item));
                    setSelectedAdmission(updated);
                }}
            />
        </div>
    );
}
