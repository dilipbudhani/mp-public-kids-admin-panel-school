"use client";

import React, { useState } from 'react';
import {
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    Edit2,
    Trash2,
    Mail,
    Phone,
    User,
    ChevronRight,
    SearchX
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Student {
    _id: string;
    studentId: string;
    fullName: string;
    class: string;
    section: string;
    primaryContact: string;
    status: string;
    email: string;
}

export function StudentsTable({ initialData }: { initialData: Student[] }) {
    const [data, setData] = useState(initialData);
    const [search, setSearch] = useState('');
    const [classFilter, setClassFilter] = useState('all');

    const filteredData = data.filter(item => {
        const matchesSearch = item.fullName.toLowerCase().includes(search.toLowerCase()) ||
            item.studentId.toLowerCase().includes(search.toLowerCase());
        const matchesClass = classFilter === 'all' || item.class === classFilter;
        return matchesSearch && matchesClass;
    });

    const uniqueClasses = Array.from(new Set(data.map(item => item.class))).sort();

    const deleteStudent = async (id: string) => {
        if (!window.confirm('Delete student record? This cannot be undone.')) return;

        try {
            const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            setData(prev => prev.filter(item => item._id !== id));
            toast.success('Student record removed');
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    return (
        <div className="w-full">
            <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/50">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search student by name or ID..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        className="bg-white border border-gray-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={classFilter}
                        onChange={(e) => setClassFilter(e.target.value)}
                    >
                        <option value="all">All Classes</option>
                        {uniqueClasses.map(cls => (
                            <option key={cls} value={cls}>Class {cls}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 font-semibold text-gray-600">Student Info</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">ID</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Class & Section</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Contact</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredData.map((item) => (
                            <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold">
                                            {item.fullName.charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">{item.fullName}</span>
                                            <span className="text-xs text-gray-400">{item.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 font-mono text-xs">{item.studentId}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-semibold text-gray-600">
                                        {item.class} - {item.section}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-700">{item.primaryContact}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                        item.status === 'active'
                                            ? "bg-green-50 text-green-700 border-green-100"
                                            : "bg-gray-100 text-gray-600 border-gray-200"
                                    )}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-primary transition-all">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-blue-600 transition-all">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteStudent(item._id)}
                                            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-red-600 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredData.length === 0 && (
                <div className="p-16 text-center">
                    <div className="inline-flex p-4 rounded-3xl bg-gray-50 mb-4">
                        <SearchX className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-gray-900 font-bold">No students found</h3>
                    <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
}
