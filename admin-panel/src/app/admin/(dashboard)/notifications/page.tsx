"use client";

import { useEffect, useState } from "react";
import {
    Bell,
    Search,
    Calendar,
    Users,
    ArrowRight,
    Filter,
    CheckCircle2,
    XCircle,
    Clock
} from "lucide-react";
import { format } from "date-fns";

interface NotificationLog {
    id: string;
    createdAt: string;
    message: string;
    target: string;
    sent: number;
    failed: number;
    total: number;
}

export default function NotificationsPage() {
    const [logs, setLogs] = useState<NotificationLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await fetch("/api/notifications/history");

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                console.error("Server responded with error:", res.status, errorData);
                return;
            }

            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                console.error("Expected JSON but received:", contentType);
                return;
            }

            const data = await res.json();
            setLogs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch notification logs:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(log =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.target.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
                        Notification History
                    </h1>
                    <p className="text-slate-500">
                        Track all WhatsApp messages and bulk notices sent to parents and students.
                    </p>
                </div>
            </div>

            <div className="grid gap-6">
                {/* Search & Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search messages or targets..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* History Table */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date & Time</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Target</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Message</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-20"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-full"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-16 mx-auto"></div></td>
                                        </tr>
                                    ))
                                ) : filteredLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                            No notification logs found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-slate-900 whitespace-nowrap">
                                                        {format(new Date(log.createdAt), "MMM d, yyyy")}
                                                    </span>
                                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {format(new Date(log.createdAt), "h:mm a")}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                                                    {log.target}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-slate-600 line-clamp-2 max-w-md group-hover:line-clamp-none transition-all">
                                                    {log.message}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-4">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-xs font-semibold text-emerald-600">{log.sent}</span>
                                                        <span className="text-[10px] text-slate-400 uppercase tracking-tighter">Sent</span>
                                                    </div>
                                                    {log.failed > 0 && (
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-xs font-semibold text-rose-500">{log.failed}</span>
                                                            <span className="text-[10px] text-slate-400 uppercase tracking-tighter">Failed</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
