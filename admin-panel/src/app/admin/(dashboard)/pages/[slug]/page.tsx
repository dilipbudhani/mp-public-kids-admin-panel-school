"use client";

import React, { useState, useEffect, use } from "react";
import {
    Save,
    ArrowLeft,
    Plus,
    Trash2,
    GripVertical,
    Globe,
    Image as ImageIcon,
    Layout,
    ChevronDown,
    ChevronUp,
    CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import CloudinaryUpload from "@/components/CloudinaryUpload";

const JsonEditor = ({ value, onChange, label }: { value: any, onChange: (v: any) => void, label: string }) => {
    const [text, setText] = useState(() => JSON.stringify(value || {}, null, 2));
    const [error, setError] = useState(false);

    useEffect(() => {
        setText(JSON.stringify(value || {}, null, 2));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setText(newText);
        try {
            const parsed = JSON.parse(newText);
            setError(false);
            onChange(parsed);
        } catch {
            setError(true);
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
            <textarea
                value={text}
                onChange={handleChange}
                rows={10}
                className={cn(
                    "w-full bg-slate-50 border rounded-2xl px-5 py-4 focus:ring-4 transition-all font-mono text-xs leading-relaxed",
                    error ? "border-red-400 focus:ring-red-500/20" : "border-slate-100 focus:ring-primary/5"
                )}
            />
            {error && <p className="text-[10px] text-red-500 font-bold mt-1">Invalid JSON format</p>}
        </div>
    );
};

interface Section {
    title: string;
    content?: string;
    subheading?: string;
    type?: string;
    image?: string;
    quote?: string;
    order?: number;
    key?: string;
    items?: any[];
}

interface PageData {
    title: string;
    slug: string;
    bannerImage?: string;
    content?: any;
    sections: Section[];
    metaTitle?: string;
    metaDescription?: string;
}

export default function PageEditor({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [page, setPage] = useState<PageData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [expandedSection, setExpandedSection] = useState<number | null>(0);

    useEffect(() => {
        fetchPage();
    }, [slug]);

    const fetchPage = async () => {
        try {
            const schoolId = typeof window !== 'undefined' ? localStorage.getItem("selectedSchool") : null;
            const res = await fetch(`/api/static-pages/${slug}`, {
                headers: {
                    ...(schoolId && { "x-school-id": schoolId })
                }
            });
            if (res.ok) {
                const data = await res.json();
                setPage(data);
            } else {
                toast.error("Page not found");
            }
        } catch (error) {
            toast.error("Failed to fetch page");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!page) return;
        setIsSaving(true);
        try {
            const schoolId = typeof window !== 'undefined' ? localStorage.getItem("selectedSchool") : null;
            const res = await fetch(`/api/static-pages/${slug}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(schoolId && { "x-school-id": schoolId })
                },
                body: JSON.stringify(page),
            });
            if (res.ok) {
                toast.success("Page updated successfully");
            } else {
                toast.error("Failed to update page");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    const addSection = () => {
        if (!page) return;
        const newSection: Section = {
            title: "",
            content: "",
            order: page.sections.length
        };
        const updatedPage = { ...page, sections: [...page.sections, newSection] };
        setPage(updatedPage);
        setExpandedSection(updatedPage.sections.length - 1);
    };

    const removeSection = (index: number) => {
        if (!page) return;
        if (!confirm("Remove this section?")) return;
        const newSections = page.sections.filter((_, i) => i !== index);
        setPage({ ...page, sections: newSections });
        if (expandedSection === index) setExpandedSection(null);
    };

    const updateSection = (index: number, data: Partial<Section>) => {
        if (!page) return;
        const newSections = [...page.sections];
        newSections[index] = { ...newSections[index], ...data };
        setPage({ ...page, sections: newSections });
    };

    const moveSection = (index: number, direction: 'up' | 'down') => {
        if (!page) return;
        const newSections = [...page.sections];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newSections.length) return;

        [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
        setPage({ ...page, sections: newSections });
        setExpandedSection(newIndex);
    };

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    if (!page) return (
        <div className="text-center py-20">
            <h1 className="text-2xl font-bold">Page not found</h1>
            <Link href="/admin/pages" className="text-primary hover:underline mt-4 inline-block">Back to pages</Link>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 sticky top-0 z-30 bg-surface/80 backdrop-blur-md py-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                    <Link href="/admin/pages" className="p-3 hover:bg-white rounded-2xl border border-transparent hover:border-slate-100 transition-all text-slate-400 hover:text-primary shadow-sm">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black font-playfair text-slate-900">{page.title}</h1>
                        <p className="text-xs font-mono text-slate-400 flex items-center gap-1.5 leading-none mt-1 uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Live at /{page.slug}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-primary text-white px-10 py-4 rounded-2xl hover:bg-primary/90 transition-all font-bold shadow-xl shadow-primary/20 hover:-translate-y-1 disabled:opacity-50"
                    >
                        {isSaving ? "Saving..." : <><Save className="w-5 h-5" /> Save Changes</>}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Editor */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Banner Section */}
                    <div className="bg-white rounded-5xl p-8 border border-slate-50 shadow-sm overflow-hidden relative">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                                <Layout className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold font-playfair text-slate-900">Hero Banner</h2>
                        </div>
                        <CloudinaryUpload
                            value={page.bannerImage || ""}
                            onChange={(url) => setPage({ ...page, bannerImage: url })}
                            onRemove={() => setPage({ ...page, bannerImage: "" })}
                            folder="banners"
                        />
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4 flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            High resolution recommended (1920x600px)
                        </p>
                    </div>

                    <div className="space-y-4">
                        {page.sections.map((section: any, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "bg-white rounded-4xl border transition-all duration-300 overflow-hidden",
                                    expandedSection === idx ? "border-primary shadow-xl scale-[1.01]" : "border-slate-50 shadow-sm"
                                )}
                            >
                                {/* Section Header */}
                                <div
                                    className={cn(
                                        "flex items-center justify-between p-6 cursor-pointer select-none",
                                        expandedSection === idx ? "bg-slate-50" : "hover:bg-slate-50/50"
                                    )}
                                    onClick={() => setExpandedSection(expandedSection === idx ? null : idx)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="text-slate-300">
                                            <GripVertical className="w-5 h-5" />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <h3 className="font-bold text-slate-900">
                                                    {section.title || `Untitled Section ${idx + 1}`}
                                                </h3>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                                                    {section.type || 'Standard'} Section {idx + 1}
                                                </p>
                                            </div>
                                            {section.type && (
                                                <span className="px-2 py-1 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-tighter rounded-md">
                                                    {section.type}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex bg-white rounded-lg border border-slate-100 p-1">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); moveSection(idx, 'up'); }}
                                                disabled={idx === 0}
                                                className="p-1.5 hover:bg-slate-50 text-slate-400 disabled:opacity-30 disabled:hover:bg-transparent"
                                            >
                                                <ChevronUp className="w-4 h-4" />
                                            </button>
                                            <div className="w-px bg-slate-100" />
                                            <button
                                                onClick={(e) => { e.stopPropagation(); moveSection(idx, 'down'); }}
                                                disabled={idx === page.sections.length - 1}
                                                className="p-1.5 hover:bg-slate-50 text-slate-400 disabled:opacity-30 disabled:hover:bg-transparent"
                                            >
                                                <ChevronDown className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeSection(idx); }}
                                            className="p-2.5 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Action Body */}
                                {expandedSection === idx && (
                                    <div className="p-8 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300 border-t border-slate-100">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Section Title</label>
                                                <input
                                                    type="text"
                                                    placeholder="Section Header"
                                                    value={section.title || ''}
                                                    onChange={(e) => updateSection(idx, { title: e.target.value })}
                                                    className="w-full bg-slate-50 border-slate-100 rounded-xl px-5 py-3.5 focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Layout Type</label>
                                                <select
                                                    value={section.type || "standard"}
                                                    onChange={(e) => updateSection(idx, { type: e.target.value })}
                                                    className="w-full bg-slate-50 border-slate-100 rounded-xl px-5 py-3.5 focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 appearance-none"
                                                >
                                                    <option value="standard">Standard (Content + Image)</option>
                                                    <option value="grid">Grid (Icon + Text items)</option>
                                                    <option value="accordion">Accordion (FAQ Style)</option>
                                                    <option value="featured">Featured (Cards)</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Section Key (Optional)</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., academic_overview"
                                                    value={section.key || ''}
                                                    onChange={(e) => updateSection(idx, { key: e.target.value })}
                                                    className="w-full bg-slate-50 border-slate-100 rounded-xl px-5 py-3.5 focus:ring-4 focus:ring-primary/5 transition-all font-mono text-sm text-slate-900"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                            <div className="md:col-span-12 space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Hero Subheading (Optional)</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., OUR VISION"
                                                    value={section.subheading || ''}
                                                    onChange={(e) => updateSection(idx, { subheading: e.target.value })}
                                                    className="w-full bg-slate-50 border-slate-100 rounded-xl px-5 py-3.5 focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900"
                                                />
                                            </div>

                                            {section.type === 'grid' || section.items ? (
                                                <div className="md:col-span-12">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Structured Items (JSON)</label>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => updateSection(idx, { items: [...(section.items || []), { title: "New Item", content: "Details...", icon: "Star" }] })}
                                                                className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 px-3 py-1 rounded-lg transition-all"
                                                            >
                                                                + Add Item
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <JsonEditor
                                                        label=""
                                                        value={section.items || []}
                                                        onChange={(parsed) => updateSection(idx, { items: parsed })}
                                                    />
                                                    <p className="text-[10px] text-slate-400 font-bold mt-2 italic px-2">
                                                        Items should follow format: {"{ title, content, icon }"}
                                                    </p>
                                                </div>
                                            ) : null}

                                            <div className="md:col-span-12 space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Body Text (Markdown Support)</label>
                                                <textarea
                                                    rows={6}
                                                    placeholder="Write section content here..."
                                                    value={section.content || ''}
                                                    onChange={(e) => updateSection(idx, { content: e.target.value })}
                                                    className="w-full bg-slate-50 border-slate-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-primary/5 transition-all text-slate-700 leading-relaxed font-medium min-h-[150px]"
                                                />
                                            </div>

                                            <div className="md:col-span-12 space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Featured Quote (Optional)</label>
                                                <textarea
                                                    rows={3}
                                                    placeholder="e.g., Education is the passport to the future..."
                                                    value={section.quote || ''}
                                                    onChange={(e) => updateSection(idx, { quote: e.target.value })}
                                                    className="w-full bg-slate-50 border-slate-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-primary/5 transition-all text-slate-700 italic font-serif leading-relaxed"
                                                />
                                            </div>

                                            <div className="md:col-span-12 space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Visual Asset (Optional)</label>
                                                <CloudinaryUpload
                                                    value={section.image || ""}
                                                    onChange={(url) => updateSection(idx, { image: url })}
                                                    onRemove={() => updateSection(idx, { image: "" })}
                                                    folder="pages"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={addSection}
                        className="w-full py-10 rounded-5xl border-4 border-dashed border-slate-100 hover:border-primary/20 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-3 group"
                    >
                        <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all">
                            <Plus className="w-8 h-8" />
                        </div>
                        <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-primary transition-all">Add New Content Block</span>
                    </button>
                </div>
            </div>

            {/* Sidebar (SEO & Settings) */}
            <div className="lg:col-span-4 space-y-8">
                <div className="bg-white rounded-5xl p-8 border border-slate-50 shadow-sm space-y-8 sticky top-32">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                            <Globe className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold font-playfair text-slate-900">Search Presence</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Meta Title</label>
                            <input
                                type="text"
                                value={page.metaTitle}
                                onChange={(e) => setPage({ ...page, metaTitle: e.target.value })}
                                className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-3 focus:ring-4 focus:ring-primary/5 transition-all font-bold text-sm"
                                placeholder="Page SEO Title"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Meta Description</label>
                            <textarea
                                rows={4}
                                value={page.metaDescription}
                                onChange={(e) => setPage({ ...page, metaDescription: e.target.value })}
                                className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-3 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium leading-relaxed"
                                placeholder="Brief summary for Google search results..."
                            />
                        </div>

                        {/* SEO Preview Card */}
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <p className="text-xs font-black uppercase tracking-tightest text-slate-400 mb-4 opacity-50">Search Preview</p>
                            <h4 className="text-blue-600 font-medium text-lg truncate hover:underline cursor-pointer">{page.metaTitle || page.title} | MP Kids School</h4>
                            <p className="text-emerald-700 text-xs mt-1 truncate">mpkidsschool.edu.in/{page.slug}</p>
                            <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">{page.metaDescription || "No description set yet. Search engines will generate one automatically."}</p>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-50">
                        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100/50">
                            <p className="text-[10px] text-amber-700 leading-relaxed font-bold uppercase tracking-widest text-center flex items-center justify-center gap-2">
                                <ImageIcon className="w-3.5 h-3.5" />
                                Dynamic CMS Content
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
