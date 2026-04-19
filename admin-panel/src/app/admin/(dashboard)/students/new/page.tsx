import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { StudentForm } from '@/components/students/StudentForm';

export default function NewStudentPage() {
    return (
        <div className="p-6 space-y-8">
            <div className="flex flex-col gap-4">
                <Link
                    href="/admin/students"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors group w-fit"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Student Directory
                </Link>
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold font-playfair tracking-tight">Add New Student</h1>
                    <p className="text-gray-500">Register a new student by filling in the details below.</p>
                </div>
            </div>

            <StudentForm />
        </div>
    );
}
