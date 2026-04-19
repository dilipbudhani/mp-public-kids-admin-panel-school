'use client';

import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    MoreVertical,
    Eye,
    Edit,
    UserPlus,
    Download,
    GraduationCap,
    Users,
    CheckCircle,
    X,
    ChevronRight,
    ChevronLeft,
    Mail,
    Phone,
    MapPin,
    Calendar,
    AlertCircle,
    MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { BulkNoticePanel } from './BulkNoticePanel';

interface Student {
    id: string;
    studentId: string;
    fullName: string;
    class: string;
    section: string;
    academicYear: string;
    status: string;
    primaryContact: string;
    email: string;
    gender: string;
    admissionDate: string;
    fatherName: string;
    motherName: string;
    address: string;
    city: string;
    pincode: string;
    rollNo?: string;
    bloodGroup?: string;
    aadhaarNo?: string;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const statusConfig: any = {
    active: { color: "text-emerald-500", bg: "bg-emerald-50", label: "Active" },
    suspended: { color: "text-amber-500", bg: "bg-amber-50", label: "Suspended" },
    graduated: { color: "text-blue-500", bg: "bg-blue-50", label: "Graduated" },
    left: { color: "text-rose-500", bg: "bg-rose-50", label: "Left" },
};

export function ClientStudentsTable({ initialStudents, initialPagination }: { initialStudents: Student[], initialPagination: Pagination }) {
    const [students, setStudents] = useState<Student[]>(initialStudents);
    const [pagination, setPagination] = useState<Pagination>(initialPagination);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterClass, setFilterClass] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isPromoting, setIsPromoting] = useState(false);
    const [isNoticePanelOpen, setIsNoticePanelOpen] = useState(false);
    const [noticeTarget, setNoticeTarget] = useState<{ count: number, ids: string[] }>({ count: 0, ids: [] });

    const classes = ["Playgroup", "Nursery", "LKG", "UKG", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];

    const fetchStudents = async (page = 1) => {
        setIsLoading(true);
        try {
            const query = new URLSearchParams({
                search: searchTerm,
                class: filterClass === 'all' ? '' : filterClass,
                status: filterStatus === 'all' ? '' : filterStatus,
                page: page.toString(),
                limit: '10'
            });
            const res = await fetch(`/api/students?${query}`);
            const data = await res.json();
            setStudents(data.students);
            setPagination(data.pagination);
            setCurrentPage(page);
        } catch (error) {
            toast.error("Failed to fetch students");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchStudents(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, filterClass, filterStatus]);

    const handleExportCSV = () => {
        const headers = ["Student ID", "Full Name", "Class", "Section", "Roll No", "Status", "Contact", "Email"];
        const rows = students.map(s => [
            s.studentId,
            s.fullName,
            s.class,
            s.section,
            s.rollNo || "N/A",
            s.status,
            s.primaryContact,
            s.email
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `students_export_${new RegExp('-').test(filterClass) ? filterClass : 'all'}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(students.map(s => s.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    const handlePromote = async (ids: string[]) => {
        if (!confirm(`Are you sure you want to promote ${ids.length} student(s) to the next class?`)) return;

        setIsPromoting(true);
        try {
            const res = await fetch('/api/students/promote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentIds: ids })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || "Promotion successful");
                fetchStudents(currentPage);
                setSelectedIds([]);
                setIsPanelOpen(false);
            } else {
                toast.error(data.error || "Promotion failed");
            }
        } catch (error) {
            toast.error("An error occurred during promotion");
        } finally {
            setIsPromoting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, ID or contact..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <select
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
                        value={filterClass}
                        onChange={(e) => setFilterClass(e.target.value)}
                    >
                        <option value="all">All Classes</option>
                        {classes.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="graduated">Graduated</option>
                        <option value="left">Left</option>
                    </select>
                    <button
                        onClick={handleExportCSV}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                        title="Export CSV"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 w-10">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        onChange={handleSelectAll}
                                        checked={students.length > 0 && selectedIds.length === students.length}
                                    />
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Class & ID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Info</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-4">
                                            <div className="h-12 bg-gray-100 rounded-xl w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No students found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                students.map((student) => (
                                    <tr key={student.id} className={cn(
                                        "hover:bg-gray-50 transition-colors group",
                                        selectedIds.includes(student.id) && "bg-primary/5 hover:bg-primary/10"
                                    )}>
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                checked={selectedIds.includes(student.id)}
                                                onChange={() => handleSelectOne(student.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {student.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{student.fullName}</p>
                                                    <p className="text-xs text-gray-500">{student.gender}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-900">Class {student.class}-{student.section}</p>
                                            <p className="text-xs text-primary font-mono">{student.studentId}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                                    <Phone className="w-3 h-3" />
                                                    {student.primaryContact}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                                    <Mail className="w-3 h-3" />
                                                    {student.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1",
                                                statusConfig[student.status]?.bg,
                                                statusConfig[student.status]?.color
                                            )}>
                                                {statusConfig[student.status]?.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => { setSelectedStudent(student); setIsPanelOpen(true); }}
                                                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="px-6 py-4 flex items-center justify-between bg-white border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-medium">{pagination.total}</span> students
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPage === 1 || isLoading}
                                onClick={() => fetchStudents(currentPage - 1)}
                                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            {Array.from({ length: pagination.totalPages }).map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => fetchStudents(i + 1)}
                                    className={cn(
                                        "w-8 h-8 text-sm font-medium rounded-lg transition-all",
                                        currentPage === i + 1 ? "bg-primary text-white" : "hover:bg-gray-50 text-gray-600"
                                    )}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                disabled={currentPage === pagination.totalPages || isLoading}
                                onClick={() => fetchStudents(currentPage + 1)}
                                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Slide-over Panel */}
            <AnimatePresence>
                {isPanelOpen && selectedStudent && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsPanelOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
                        >
                            <div className="p-6 h-full flex flex-col">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-bold font-playfair">Student Profile</h2>
                                    <button onClick={() => setIsPanelOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-100 text-center">
                                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold mb-4 shadow-inner">
                                        {selectedStudent.fullName.charAt(0)}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">{selectedStudent.fullName}</h3>
                                    <p className="text-sm font-mono text-primary mt-1">{selectedStudent.studentId}</p>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-xs font-semibold",
                                            statusConfig[selectedStudent.status]?.bg,
                                            statusConfig[selectedStudent.status]?.color
                                        )}>
                                            {statusConfig[selectedStudent.status]?.label}
                                        </span>
                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                                            Class {selectedStudent.class}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-6 flex-1">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Academic Details</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 bg-gray-50 rounded-xl">
                                                <p className="text-[10px] text-gray-500 uppercase font-bold">Academic Year</p>
                                                <p className="text-sm font-semibold">{selectedStudent.academicYear}</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-xl">
                                                <p className="text-[10px] text-gray-500 uppercase font-bold">Roll Number</p>
                                                <p className="text-sm font-semibold">{selectedStudent.rollNo || 'Pending'}</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-xl">
                                                <p className="text-[10px] text-gray-500 uppercase font-bold">Section</p>
                                                <p className="text-sm font-semibold">{selectedStudent.section}</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-xl">
                                                <p className="text-[10px] text-gray-500 uppercase font-bold">Admission Date</p>
                                                <p className="text-sm font-semibold">{selectedStudent.admissionDate}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contact Information</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-all">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                    <Phone className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold text-left">Primary Contact</p>
                                                    <p className="text-sm font-semibold">{selectedStudent.primaryContact}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-all">
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                                    <Mail className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold text-left">Email Address</p>
                                                    <p className="text-sm font-semibold">{selectedStudent.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-all">
                                                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                                                    <MapPin className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold text-left">Address</p>
                                                    <p className="text-sm font-semibold leading-snug">{selectedStudent.address}, {selectedStudent.city} - {selectedStudent.pincode}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Parent Details</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 border border-gray-100 rounded-xl">
                                                <p className="text-[10px] text-gray-500 uppercase font-bold">Father's Name</p>
                                                <p className="text-sm font-semibold">{selectedStudent.fatherName}</p>
                                            </div>
                                            <div className="p-3 border border-gray-100 rounded-xl">
                                                <p className="text-[10px] text-gray-500 uppercase font-bold">Mother's Name</p>
                                                <p className="text-sm font-semibold">{selectedStudent.motherName}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => {
                                            setNoticeTarget({ count: 1, ids: [selectedStudent.id] });
                                            setIsNoticePanelOpen(true);
                                        }}
                                        className="flex-1 py-3 px-4 bg-emerald-50 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Phone className="w-4 h-4" /> Message
                                    </button>
                                    <button
                                        onClick={() => handlePromote([selectedStudent.id])}
                                        disabled={isPromoting}
                                        className="flex-1 py-3 px-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isPromoting ? (
                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <GraduationCap className="w-4 h-4" />
                                        )}
                                        Promote
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Bulk Actions Bar */}
            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-8 border border-white/10"
                    >
                        <div className="flex items-center gap-3 pr-8 border-r border-white/10">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold">
                                {selectedIds.length}
                            </div>
                            <span className="text-sm font-medium">Students Selected</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => handlePromote(selectedIds)}
                                disabled={isPromoting}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50"
                            >
                                {isPromoting ? (
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <GraduationCap className="w-4 h-4" />
                                )}
                                Bulk Promote
                            </button>
                            <button
                                onClick={() => {
                                    setNoticeTarget({ count: selectedIds.length, ids: selectedIds });
                                    setIsNoticePanelOpen(true);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all"
                            >
                                <MessageSquare className="w-4 h-4 text-primary" />
                                Send Notice
                            </button>
                            <button
                                onClick={() => setSelectedIds([])}
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                Clear Selection
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bulk Notice Panel */}
            <BulkNoticePanel
                isOpen={isNoticePanelOpen}
                onClose={() => setIsNoticePanelOpen(false)}
                selectedCount={noticeTarget.count}
                selectedIds={noticeTarget.ids}
                onSuccess={() => {
                    setSelectedIds([]);
                    setIsPanelOpen(false);
                }}
            />
        </div>
    );
}
