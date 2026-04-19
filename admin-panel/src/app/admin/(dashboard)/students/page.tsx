import { dbConnect } from '@/lib/mongodb';
import Student from '@/models/Student';
import {
    GraduationCap,
    Users,
    Search,
    Plus,
    Filter,
    ArrowUpRight
} from 'lucide-react';
import { StudentsTable } from '@/components/students/StudentsTable';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function StudentsPage() {
    await dbConnect();
    const students = await Student.find().sort({ fullName: 1 }).lean();

    const stats = {
        total: students.length,
        active: students.filter((s: any) => s.status === 'active').length,
        new: students.filter((s: any) => {
            const date = new Date(s.admissionDate);
            const now = new Date();
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }).length,
    };

    return (
        <div className="p-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold font-playfair tracking-tight">Student Directory</h1>
                    <p className="text-gray-500">Manage student records, academic years, and contact details.</p>
                </div>
                <Link
                    href="/admin/students/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus className="w-5 h-5" />
                    Add Student
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 rounded-xl">
                        <Users className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Students</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-50 rounded-xl">
                        <GraduationCap className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Active Students</p>
                        <p className="text-2xl font-bold">{stats.active}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-50 rounded-xl">
                        <ArrowUpRight className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">New This Month</p>
                        <p className="text-2xl font-bold">{stats.new}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <StudentsTable initialData={JSON.parse(JSON.stringify(students))} />
            </div>
        </div>
    );
}
