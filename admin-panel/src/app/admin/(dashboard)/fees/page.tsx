"use client";

import React, { useState, useEffect } from "react";
import {
    Save,
    Plus,
    Trash2,
    Wallet,
    Truck,
    CreditCard,
    PlusCircle,
    Info,
    LayoutDashboard
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FeeHead {
    head: string;
    amount: string;
    frequency: string;
    notes: string;
}

interface FeeCategory {
    id: string;
    label: string;
    fees: FeeHead[];
}

interface TransportZone {
    zone: string;
    area: string;
    fee: string;
}

interface PaymentMethod {
    name: string;
    iconName: string;
    color: string;
    bg: string;
    note: string;
}

interface ImportantNote {
    title: string;
    text: string;
}

export default function FeesAdminPage() {
    const [categories, setCategories] = useState<FeeCategory[]>([]);
    const [transportZones, setTransportZones] = useState<TransportZone[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [importantNotes, setImportantNotes] = useState<ImportantNote[]>([]);
    const [academicYear, setAcademicYear] = useState("2026-27");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("categories");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/fees");
            if (res.ok) {
                const data = await res.json();
                if (data && data.categories) {
                    setCategories(data.categories);
                    setTransportZones(data.transportZones || []);
                    setPaymentMethods(data.paymentMethods || []);
                    setImportantNotes(data.importantNotes || []);
                    setAcademicYear(data.academicYear || "2026-27");
                }
            }
        } catch (error) {
            toast.error("Failed to fetch data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/fees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    categories,
                    transportZones,
                    paymentMethods,
                    importantNotes,
                    academicYear
                }),
            });

            if (res.ok) {
                toast.success("Fee structure updated successfully");
            } else {
                toast.error("Failed to save changes");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSaving(false);
        }
    };

    const addCategory = () => {
        const newCat: FeeCategory = {
            id: `cat-${Date.now()}`,
            label: "New Category",
            fees: []
        };
        setCategories([...categories, newCat]);
    };

    const removeCategory = (id: string) => {
        setCategories(categories.filter(c => c.id !== id));
    };

    const addFeeHead = (catId: string) => {
        setCategories(categories.map(cat => {
            if (cat.id === catId) {
                return {
                    ...cat,
                    fees: [...cat.fees, { head: "New Fee Head", amount: "0", frequency: "Monthly", notes: "" }]
                };
            }
            return cat;
        }));
    };

    const updateFeeHead = (catId: string, feeIdx: number, field: keyof FeeHead, value: string) => {
        setCategories(categories.map(cat => {
            if (cat.id === catId) {
                const newFees = [...cat.fees];
                newFees[feeIdx] = { ...newFees[feeIdx], [field]: value };
                return { ...cat, fees: newFees };
            }
            return cat;
        }));
    };

    const removeFeeHead = (catId: string, feeIdx: number) => {
        setCategories(categories.map(cat => {
            if (cat.id === catId) {
                const newFees = cat.fees.filter((_, idx) => idx !== feeIdx);
                return { ...cat, fees: newFees };
            }
            return cat;
        }));
    };

    if (isLoading) return <div className="p-8">Loading Fee Configuration...</div>;

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black font-playfair text-slate-900">Fee Structure Manager</h1>
                    <p className="text-slate-500 mt-1 italic">Configure tuition fees, transport zones, and payment policies</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Academic Year</span>
                        <input
                            value={academicYear}
                            onChange={(e) => setAcademicYear(e.target.value)}
                            className="w-24 font-bold text-primary focus:outline-hidden"
                        />
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-primary text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:shadow-xl transition-all disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-4 border-b border-slate-200">
                {[
                    { id: 'categories', label: 'Fee Categories', icon: Wallet },
                    { id: 'transport', label: 'Transport Zones', icon: Truck },
                    { id: 'payments', label: 'Payment Methods', icon: CreditCard },
                    { id: 'notes', label: 'Important Notes', icon: Info },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-4 text-sm font-black uppercase tracking-widest transition-all border-b-2",
                            activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="mt-8">
                {activeTab === 'categories' && (
                    <div className="space-y-10">
                        {categories.map((cat, catIdx) => (
                            <div key={cat.id} className="bg-white rounded-4xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                                <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black">
                                            {catIdx + 1}
                                        </div>
                                        <input
                                            value={cat.label}
                                            onChange={(e) => setCategories(categories.map(c => c.id === cat.id ? { ...c, label: e.target.value } : c))}
                                            className="text-xl font-black font-playfair bg-transparent border-b-2 border-transparent focus:border-primary focus:outline-hidden px-2"
                                        />
                                    </div>
                                    <button
                                        onClick={() => removeCategory(cat.id)}
                                        className="p-2 text-red-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="p-8">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                                                <th className="px-4 py-4 text-left">Fee Head</th>
                                                <th className="px-4 py-4 text-left">Amount (₹)</th>
                                                <th className="px-4 py-4 text-left">Frequency</th>
                                                <th className="px-4 py-4 text-left">Notes</th>
                                                <th className="px-4 py-4 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {cat.fees.map((fee, feeIdx) => (
                                                <tr key={feeIdx} className="group">
                                                    <td className="px-4 py-4">
                                                        <input
                                                            value={fee.head}
                                                            onChange={(e) => updateFeeHead(cat.id, feeIdx, 'head', e.target.value)}
                                                            className="w-full bg-slate-50 border-transparent focus:border-primary rounded-lg px-3 py-2 text-sm font-bold"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <input
                                                            value={fee.amount}
                                                            onChange={(e) => updateFeeHead(cat.id, feeIdx, 'amount', e.target.value)}
                                                            className="w-full bg-slate-50 border-transparent focus:border-primary rounded-lg px-3 py-2 text-sm font-black text-primary"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <select
                                                            value={fee.frequency}
                                                            onChange={(e) => updateFeeHead(cat.id, feeIdx, 'frequency', e.target.value)}
                                                            className="w-full bg-slate-50 border-transparent focus:border-primary rounded-lg px-3 py-2 text-sm font-medium"
                                                        >
                                                            <option>Monthly</option>
                                                            <option>Quarterly</option>
                                                            <option>Annually</option>
                                                            <option>One-time</option>
                                                            <option>-</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <input
                                                            value={fee.notes}
                                                            onChange={(e) => updateFeeHead(cat.id, feeIdx, 'notes', e.target.value)}
                                                            className="w-full bg-slate-50 border-transparent focus:border-primary rounded-lg px-3 py-2 text-xs italic"
                                                            placeholder="Optional notes..."
                                                        />
                                                    </td>
                                                    <td className="px-4 py-4 text-right">
                                                        <button
                                                            onClick={() => removeFeeHead(cat.id, feeIdx)}
                                                            className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <button
                                        onClick={() => addFeeHead(cat.id)}
                                        className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-primary/70 transition-colors"
                                    >
                                        <PlusCircle className="w-4 h-4" />
                                        Add Fee Head
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={addCategory}
                            className="w-full py-8 border-4 border-dashed border-slate-100 rounded-4xl text-slate-300 hover:border-primary/20 hover:text-primary transition-all flex flex-col items-center gap-3"
                        >
                            <Plus className="w-10 h-10" />
                            <span className="font-black uppercase tracking-widest text-sm">Add New Grade Category</span>
                        </button>
                    </div>
                )}

                {activeTab === 'transport' && (
                    <div className="bg-white rounded-4xl border border-slate-100 shadow-xl p-10">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-2xl font-black font-playfair text-primary">Transport Fee Matrix</h2>
                            <button
                                onClick={() => setTransportZones([...transportZones, { zone: "New Zone", area: "", fee: "0" }])}
                                className="bg-primary/10 text-primary px-6 py-2 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all"
                            >
                                Add Zone
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {transportZones.map((z, idx) => (
                                <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 group">
                                    <div className="flex justify-between items-start mb-4">
                                        <input
                                            value={z.zone}
                                            onChange={(e) => setTransportZones(transportZones.map((tz, i) => i === idx ? { ...tz, zone: e.target.value } : tz))}
                                            className="font-black text-primary bg-transparent focus:outline-hidden w-2/3"
                                        />
                                        <button onClick={() => setTransportZones(transportZones.filter((_, i) => i !== idx))}><Trash2 className="w-4 h-4 text-red-300" /></button>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Coverage Area</label>
                                            <input
                                                value={z.area}
                                                onChange={(e) => setTransportZones(transportZones.map((tz, i) => i === idx ? { ...tz, area: e.target.value } : tz))}
                                                className="w-full bg-white border border-slate-100 rounded-lg px-3 py-2 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Monthly Fee (₹)</label>
                                            <input
                                                value={z.fee}
                                                onChange={(e) => setTransportZones(transportZones.map((tz, i) => i === idx ? { ...tz, fee: e.target.value } : tz))}
                                                className="w-full bg-white border border-slate-100 rounded-lg px-3 py-2 text-sm font-black"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Simplified Payment Methods & Notes sections for conciseness but full functionality */}
                {activeTab === 'payments' && (
                    <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-xl">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black font-playfair text-primary">Payment Methods</h2>
                            <button
                                onClick={() => setPaymentMethods([...paymentMethods, { name: "Method", iconName: "Smartphone", color: "text-blue-600", bg: "bg-blue-50", note: "" }])}
                                className="text-primary font-black uppercase tracking-widest text-xs"
                            >
                                Add Method
                            </button>
                        </div>
                        <div className="space-y-4">
                            {paymentMethods.map((m, idx) => (
                                <div key={idx} className="p-4 bg-slate-50 rounded-2xl flex gap-6 items-center">
                                    <div className="flex-1 space-y-2">
                                        <input value={m.name} onChange={(e) => setPaymentMethods(paymentMethods.map((pm, i) => i === idx ? { ...pm, name: e.target.value } : pm))} className="font-bold bg-transparent border-b border-transparent focus:border-primary w-full" />
                                        <input value={m.note} onChange={(e) => setPaymentMethods(paymentMethods.map((pm, i) => i === idx ? { ...pm, note: e.target.value } : pm))} className="text-xs text-slate-500 w-full bg-transparent" placeholder="Description..." />
                                    </div>
                                    <div className="flex gap-2">
                                        <input value={m.color} onChange={(e) => setPaymentMethods(paymentMethods.map((pm, i) => i === idx ? { ...pm, color: e.target.value } : pm))} className="w-24 text-[10px] bg-white rounded border border-slate-200" placeholder="Text Color Class" />
                                        <input value={m.bg} onChange={(e) => setPaymentMethods(paymentMethods.map((pm, i) => i === idx ? { ...pm, bg: e.target.value } : pm))} className="w-24 text-[10px] bg-white rounded border border-slate-200" placeholder="BG Color Class" />
                                    </div>
                                    <button onClick={() => setPaymentMethods(paymentMethods.filter((_, i) => i !== idx))}><Trash2 className="w-4 h-4 text-red-300" /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'notes' && (
                    <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-xl">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black font-playfair text-primary">Policies & Notes</h2>
                            <button
                                onClick={() => setImportantNotes([...importantNotes, { title: "New Policy", text: "" }])}
                                className="text-primary font-black uppercase tracking-widest text-xs"
                            >
                                Add Note
                            </button>
                        </div>
                        <div className="space-y-6">
                            {importantNotes.map((n, idx) => (
                                <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex justify-between mb-4">
                                        <input value={n.title} onChange={(e) => setImportantNotes(importantNotes.map((inote, i) => i === idx ? { ...inote, title: e.target.value } : inote))} className="font-black text-slate-900 bg-transparent w-full" />
                                        <button onClick={() => setImportantNotes(importantNotes.filter((_, i) => i !== idx))}><Trash2 className="w-4 h-4 text-red-300" /></button>
                                    </div>
                                    <textarea
                                        value={n.text}
                                        onChange={(e) => setImportantNotes(importantNotes.map((inote, i) => i === idx ? { ...inote, text: e.target.value } : inote))}
                                        className="w-full bg-white border border-slate-100 rounded-xl p-4 text-sm"
                                        rows={2}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
