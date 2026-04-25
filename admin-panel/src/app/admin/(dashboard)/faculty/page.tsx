"use client";

import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, GraduationCap, User, Mail, Save, X, Search, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Faculty {
    _id: string;
    name: string;
    designation: string;
    department: string | null;
    qualification: string | null;
    experience: string | null;
    imageUrl: string | null;
    order: number;
}

export default function FacultyAdminPage() {
    const [faculty, setFaculty] = useState<Faculty[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Faculty>>({});
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchFaculty();
    }, []);

    const fetchFaculty = async () => {
        setIsLoading(true);
        try {
            const schoolId = typeof window !== 'undefined' ? localStorage.getItem("selectedSchool") : null;
            const res = await fetch(`/api/faculty${schoolId ? `?schoolId=${schoolId}` : ""}`);
            if (res.ok) {
                const data = await res.json();
                setFaculty(data);
            }
        } catch (error) {
            toast.error("Failed to fetch faculty");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (item: Faculty) => {
        setIsEditing(item._id);
        setEditForm(item);
    };

    const handleCancel = () => {
        setIsEditing(null);
        setEditForm({});
    };

    const handleSave = async () => {
        try {
            const method = isEditing === "new" ? "POST" : "PUT";
            const url = isEditing === "new" ? "/api/faculty" : `/api/faculty/${isEditing}`;

            const schoolId = typeof window !== 'undefined' ? localStorage.getItem("selectedSchool") : null;
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    ...(schoolId && { "x-school-id": schoolId })
                },
                body: JSON.stringify(editForm),
            });

            if (res.ok) {
                toast.success(`Faculty ${isEditing === "new" ? "created" : "updated"} successfully`);
                fetchFaculty();
                setIsEditing(null);
            } else {
                toast.error("Failed to save faculty record");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this faculty record?")) return;

        try {
            const schoolId = typeof window !== 'undefined' ? localStorage.getItem("selectedSchool") : null;
            const res = await fetch(`/api/faculty/${id}`, {
                method: "DELETE",
                headers: {
                    ...(schoolId && { "x-school-id": schoolId })
                }
            });

            if (res.ok) {
                toast.success("Faculty record deleted");
                fetchFaculty();
            }
        } catch (error) {
            toast.error("Failed to delete faculty");
        }
    };

    const handleAddNew = () => {
        setIsEditing("new");
        setEditForm({
            name: "",
            designation: "",
            department: "Primary",
            qualification: "",
            experience: "",
            imageUrl: "",
            order: faculty.length,
        });
    };

    const filteredFaculty = faculty.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading && faculty.length === 0) {
        return <div className="animate-pulse">Loading faculty records...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold font-playfair">Faculty Management</h1>
                    <p className="text-gray-500">Manage school staff profiles and records</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/90 transition-all font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Add Staff
                </button>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name, designation or department..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isEditing === "new" && (
                    <div className="bg-white rounded-2xl border-2 border-primary p-6 shadow-xl animate-in zoom-in duration-300">
                        <h2 className="text-lg font-bold mb-4">New Staff Member</h2>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={editForm.name || ""}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary transition-all text-sm"
                            />
                            <input
                                type="text"
                                placeholder="Designation (e.g. Principal)"
                                value={editForm.designation || ""}
                                onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary transition-all text-sm"
                            />
                            <select
                                value={editForm.department || ""}
                                onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary transition-all text-sm"
                            >
                                <option value="Administration">Administration</option>
                                <option value="Primary">Primary Section</option>
                                <option value="Secondary">Secondary Section</option>
                                <option value="Higher Secondary">Higher Secondary</option>
                                <option value="Sports">Sports</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Qualification"
                                value={editForm.qualification || ""}
                                onChange={(e) => setEditForm({ ...editForm, qualification: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary transition-all text-sm"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/90 text-sm font-medium"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {filteredFaculty.map((item) => (
                    <div
                        key={item._id}
                        className={cn(
                            "bg-white rounded-2xl border border-gray-100 overflow-hidden group transition-all hover:shadow-lg",
                            isEditing === item._id && "ring-2 ring-primary border-transparent"
                        )}
                    >
                        <div className="p-6">
                            {isEditing === item._id ? (
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={editForm.name || ""}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary text-sm"
                                    />
                                    <input
                                        type="text"
                                        value={editForm.designation || ""}
                                        onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary text-sm"
                                    />
                                    <div className="flex gap-2 mt-4">
                                        <button onClick={handleCancel} className="flex-1 text-xs text-gray-500 py-2 border rounded-lg">Cancel</button>
                                        <button onClick={handleSave} className="flex-1 text-xs bg-primary text-white py-2 rounded-lg">Save</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center border-2 border-primary/10">
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-2xl" />
                                            ) : (
                                                <User className="w-8 h-8 text-primary/40" />
                                            )}
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                                        <p className="text-primary text-sm font-medium mb-4">{item.designation}</p>

                                        <div className="space-y-2 pt-4 border-t border-gray-50">
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Briefcase className="w-3 h-3" />
                                                <span>{item.department}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <GraduationCap className="w-3 h-3" />
                                                <span className="line-clamp-1">{item.qualification || "Not specified"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredFaculty.length === 0 && !isLoading && isEditing !== "new" && (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <User className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900">No staff records found</h3>
                    <p className="text-gray-500 max-w-xs mx-auto mt-2">Start by adding your first faculty member to build the directory.</p>
                </div>
            )}
        </div>
    );
}
