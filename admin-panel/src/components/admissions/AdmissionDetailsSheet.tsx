"use client";

import React, { useState } from 'react';
import Modal from '@/components/Modal';
import {
    CheckCircle2,
    XCircle,
    Clock,
    User,
    Users,
    Calendar,
    MapPin,
    Phone,
    Mail,
    School,
    FileText,
    ExternalLink,
    AlertTriangle,
    Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

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

interface AdmissionDetailsSheetProps {
    admission: Admission | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updated: Admission) => void;
}

export function AdmissionDetailsSheet({ admission, isOpen, onClose, onUpdate }: AdmissionDetailsSheetProps) {
    const [loading, setLoading] = useState(false);

    if (!admission) return null;

    const updateStatus = async (newStatus: string) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/admissions/${admission._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) throw new Error('Failed to update status');

            const updated = await res.json();
            onUpdate(updated);
            toast.success(`Application ${newStatus.toLowerCase()} successfully`);
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const deleteApplication = async () => {
        if (!window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) return;

        try {
            setLoading(true);
            const res = await fetch(`/api/admissions/${admission._id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Failed to delete application');

            toast.success('Application deleted');
            onClose();
            // Note: In a real app, you'd want to remove it from the list in the parent
            window.location.reload();
        } catch (error) {
            toast.error('Failed to delete');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Application #${admission.applicationNo}`}
            className="max-w-4xl"
        >
            <div className="space-y-8 pb-8">
                {/* Header Status Bar */}
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Status</span>
                            <span className="font-semibold text-primary">{admission.status}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {admission.status !== 'APPROVED' && (
                            <button
                                onClick={() => updateStatus('APPROVED')}
                                disabled={loading}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-all disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                Approve
                            </button>
                        )}
                        {admission.status !== 'REJECTED' && (
                            <button
                                onClick={() => updateStatus('REJECTED')}
                                disabled={loading}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-all disabled:opacity-50"
                            >
                                <XCircle className="w-4 h-4" />
                                Reject
                            </button>
                        )}
                        {admission.status !== 'WAITLISTED' && (
                            <button
                                onClick={() => updateStatus('WAITLISTED')}
                                disabled={loading}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-xl text-sm font-medium hover:bg-purple-100 transition-all disabled:opacity-50"
                            >
                                <Clock className="w-4 h-4" />
                                Waitlist
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Student Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
                            <User className="w-5 h-5 text-primary" /> Student Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Full Name</p>
                                <p className="text-sm font-medium text-gray-900">{admission.studentName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Gender</p>
                                <p className="text-sm font-medium text-gray-900">{admission.gender}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">DOB</p>
                                <p className="text-sm font-medium text-gray-900">{admission.dateOfBirth}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Applying For</p>
                                <p className="px-2 py-0.5 bg-gray-100 rounded text-xs inline-block font-bold">
                                    Class {admission.applyingForClass}
                                </p>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2 mt-8">
                            <Users className="w-5 h-5 text-primary" /> Parent Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Father's Name</p>
                                <p className="text-sm font-medium text-gray-900">{admission.fatherName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Mother's Name</p>
                                <p className="text-sm font-medium text-gray-900">{admission.motherName}</p>
                            </div>
                        </div>
                    </div>

                    {/* Academic & Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
                            <Phone className="w-5 h-5 text-primary" /> Contact Details
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">{admission.email}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">{admission.primaryContact}</span>
                            </div>
                            <div className="flex items-start gap-2 bg-gray-50 p-2 rounded-xl">
                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                <span className="text-sm">{admission.address}, {admission.city} - {admission.pincode}</span>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2 mt-8">
                            <School className="w-5 h-5 text-primary" /> Previous Academic History
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Last School</p>
                                <p className="text-sm font-medium text-gray-900">{admission.previousSchool || 'N/A'}</p>
                            </div>
                            <div className="flex gap-8">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Last Class</p>
                                    <p className="text-sm font-medium text-gray-900">{admission.previousClass || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Academic Year</p>
                                    <p className="text-sm font-medium text-gray-900">{admission.academicYear}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Documents Section */}
                <div className="space-y-4 pt-4">
                    <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
                        <FileText className="w-5 h-5 text-primary" /> Uploaded Documents
                    </h3>
                    {admission.documents && admission.documents.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {admission.documents.map((doc: any, idx: number) => (
                                <a
                                    key={idx}
                                    href={doc.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 hover:border-primary/50 transition-all group"
                                >
                                    <FileText className="w-8 h-8 text-gray-400 group-hover:text-primary mb-2" />
                                    <span className="text-[10px] font-bold text-center text-gray-500 truncate w-full">
                                        {doc.name || `Document ${idx + 1}`}
                                    </span>
                                    <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-primary mt-1" />
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50 p-8 text-center rounded-2xl border border-dashed border-gray-200">
                            <p className="text-sm text-gray-500">No documents uploaded with this application.</p>
                        </div>
                    )}
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-8 border-t">
                    <button
                        onClick={deleteApplication}
                        disabled={loading}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm transition-all"
                    >
                        <AlertTriangle className="w-4 h-4" />
                        Delete Permanently
                    </button>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        Applied on {format(new Date(admission.createdAt), 'MMMM dd, yyyy HH:mm')}
                    </p>
                </div>
            </div>
        </Modal>
    );
}
