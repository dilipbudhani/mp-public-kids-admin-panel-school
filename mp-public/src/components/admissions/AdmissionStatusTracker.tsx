'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    CheckCircle2,
    Clock,
    XCircle,
    AlertCircle,
    Calendar,
    User,
    BookOpen,
    ArrowRight
} from 'lucide-react';

interface AdmissionStatus {
    found: boolean;
    applicationNo?: string;
    studentName?: string;
    applyingForClass?: string;
    academicYear?: string;
    status?: "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED" | "WAITLISTED";
    createdAt?: string;
    reviewedAt?: string;
    adminNotes?: string;
}

const statusConfig = {
    PENDING: {
        color: 'text-amber-500',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        icon: Clock,
        label: 'Pending Review',
        description: 'Your application has been received and is waiting to be reviewed by our admissions team.'
    },
    REVIEWING: {
        color: 'text-blue-500',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: Search,
        label: 'Under Review',
        description: 'Our team is currently reviewing your documents and application details.'
    },
    APPROVED: {
        color: 'text-emerald-500',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: CheckCircle2,
        label: 'Approved / Shortlisted',
        description: 'Congratulations! Your application has been approved. Please check your email for further instructions.'
    },
    REJECTED: {
        color: 'text-rose-500',
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        icon: XCircle,
        label: 'Not Selected',
        description: 'We regret to inform you that your application was not selected at this time.'
    },
    WAITLISTED: {
        color: 'text-indigo-500',
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        icon: AlertCircle,
        label: 'Waitlisted',
        description: 'Your application is on our waitlist. We will notify you if a seat becomes available.'
    }
};

function StatusTrackerContent() {
    const searchParams = useSearchParams();
    const [applicationNo, setApplicationNo] = useState(searchParams.get('applicationNo') || '');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<AdmissionStatus | null>(null);
    const [error, setError] = useState('');

    const handleTrack = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!applicationNo.trim()) return;

        setLoading(true);
        setError('');
        setStatus(null);

        try {
            const res = await fetch(`/api/admissions/status?applicationNo=${applicationNo.trim()}`);
            const data = await res.json();

            if (data.found) {
                setStatus(data);
            } else {
                setError('No application found with this number. Please double check and try again.');
            }
        } catch (err) {
            setError('Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchParams.get('applicationNo')) {
            handleTrack();
        }
    }, []);

    const Config = status?.status ? statusConfig[status.status] : null;

    return (
        <div className="max-w-3xl mx-auto px-4">
            {/* Search Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-6 md:p-8 mb-8 border border-slate-100"
            >
                <form onSubmit={handleTrack} className="space-y-4">
                    <div className="relative">
                        <label htmlFor="applicationNo" className="block text-sm font-medium text-slate-700 mb-2">
                            Application Number
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="text"
                                id="applicationNo"
                                value={applicationNo}
                                onChange={(e) => setApplicationNo(e.target.value)}
                                placeholder="Ex: MPKS-2026-00042"
                                className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-lg font-medium"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/95 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Searching...
                            </>
                        ) : (
                            <>
                                Track Status
                                <ArrowRight className="h-5 w-5" />
                            </>
                        )}
                    </button>
                </form>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600"
                    >
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </motion.div>
                )}
            </motion.div>

            {/* Result Section */}
            <AnimatePresence mode="wait">
                {status && (
                    <motion.div
                        key={status.applicationNo}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-6"
                    >
                        {/* Main Status Display */}
                        <div className={`rounded-2xl border-2 ${Config?.border} ${Config?.bg} p-6 md:p-10 text-center relative overflow-hidden`}>
                            {/* Decorative Circle Background */}
                            <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full ${Config?.color} opacity-5 z-0`} />

                            <div className="relative z-10 flex flex-col items-center">
                                <div className={`w-20 h-20 rounded-full ${Config?.bg} border-4 border-white flex items-center justify-center mb-6 shadow-sm`}>
                                    {Config && <Config.icon className={`h-10 w-10 ${Config.color}`} />}
                                </div>
                                <h2 className={`text-3xl font-serif font-bold ${Config?.color} mb-2`}>
                                    {Config?.label}
                                </h2>
                                <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
                                    {Config?.description}
                                </p>

                                {status.adminNotes && (
                                    <div className="mt-8 pt-8 border-t border-slate-200/50 w-full text-left">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Admin Remarks</p>
                                        <div className="bg-white/50 border border-slate-200/50 p-4 rounded-xl italic text-slate-700">
                                            "{status.adminNotes}"
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <User className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Student Name</p>
                                    <p className="font-bold text-slate-900">{status.studentName}</p>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <BookOpen className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Applying For</p>
                                    <p className="font-bold text-slate-900">{status.applyingForClass} ({status.academicYear})</p>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Calendar className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Applied On</p>
                                    <p className="font-bold text-slate-900">{new Date(status.createdAt!).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>

                            {status.reviewedAt && (
                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <CheckCircle2 className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase">Last Updated</p>
                                        <p className="font-bold text-slate-900">{new Date(status.reviewedAt!).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function AdmissionStatusTracker() {
    return (
        <Suspense fallback={
            <div className="flex justify-center py-12">
                <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        }>
            <StatusTrackerContent />
        </Suspense>
    );
}
