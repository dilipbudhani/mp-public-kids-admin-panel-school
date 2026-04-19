import { dbConnect } from '@/lib/mongodb';
import Admission from '@/models/Admission';
import {
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    FileText,
    Download,
    Mail
} from 'lucide-react';
import { AdmissionsTable } from '@/components/admissions/AdmissionsTable';

export const dynamic = 'force-dynamic';

export default async function AdmissionsPage() {
    await dbConnect();
    const admissions = await Admission.find().sort({ createdAt: -1 }).lean();

    const stats = {
        total: admissions.length,
        pending: admissions.filter((a: any) => a.status === 'PENDING').length,
        approved: admissions.filter((a: any) => a.status === 'APPROVED').length,
        rejected: admissions.filter((a: any) => a.status === 'REJECTED').length,
    };

    return (
        <div className="p-6 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold font-playfair tracking-tight">Admissions</h1>
                <p className="text-gray-500">Manage school admission applications and enrollment status.</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl">
                        <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Applications</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-50 rounded-xl">
                        <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Pending Review</p>
                        <p className="text-2xl font-bold">{stats.pending}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-50 rounded-xl">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Approved</p>
                        <p className="text-2xl font-bold">{stats.approved}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-red-50 rounded-xl">
                        <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Rejected</p>
                        <p className="text-2xl font-bold">{stats.rejected}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <AdmissionsTable initialData={JSON.parse(JSON.stringify(admissions))} />
            </div>
        </div>
    );
}
