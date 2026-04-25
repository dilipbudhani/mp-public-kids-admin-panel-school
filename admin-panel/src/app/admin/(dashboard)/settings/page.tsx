"use client";

import React, { useState, useEffect, useRef } from "react";
import { Save, Phone, Mail, MapPin, Globe, Facebook, Instagram, Bell, Shield, Database, Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { Youtube as YoutubeIcon, Twitter as XIcon } from "lucide-react";
import Modal from "@/components/Modal";

interface SiteSettings {
    _id: string;
    schoolName: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    facebookUrl: string | null;
    instagramUrl: string | null;
    instagramAccessToken?: string;
    instagramUserId?: string;
    instagramEnabled?: boolean;
    facebookAccessToken?: string;
    facebookPageId?: string;
    facebookEnabled?: boolean;
    youtubeApiKey?: string;
    youtubeChannelId?: string;
    youtubeEnabled?: boolean;
    twitterUrl: string | null;
    youtubeUrl: string | null;
    admissionOpen: boolean;
    announcement: string | null;
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    whatsappNumber?: string;
    mapEmbedUrl?: string;
    affiliationNo?: string;
    trustItem1Text?: string;
    trustItem1Sub?: string;
    trustItem2Text?: string;
    trustItem2Sub?: string;
    trustItem3Text?: string;
    trustItem3Sub?: string;
    trustItem4Text?: string;
    trustItem4Sub?: string;
}

export default function SettingsAdminPage() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSyncingInstagram, setIsSyncingInstagram] = useState(false);
    const [isSyncingYoutube, setIsSyncingYoutube] = useState(false);
    const [isSyncingFacebook, setIsSyncingFacebook] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [importMode, setImportMode] = useState<'restore' | 'merge'>('restore');
    const [showImportDialog, setShowImportDialog] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            let schoolId = typeof window !== 'undefined' ? localStorage.getItem("selectedSchool") : null;

            // Default to mp-kids-school if not set
            if (!schoolId) {
                schoolId = "mp-kids-school";
                localStorage.setItem("selectedSchool", schoolId);
            }

            const res = await fetch(`/api/settings${schoolId ? `?schoolId=${schoolId}` : ""}`);
            const data = await res.json();

            if (res.ok) {
                setSettings(data);
            } else {
                toast.error(data.message || "Failed to fetch settings");
                console.error("Settings error:", data);
            }
        } catch (err: any) {
            toast.error("An unexpected error occurred");
            console.error("Fetch settings fatal error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSync = async (platform: 'INSTAGRAM' | 'YOUTUBE' | 'FACEBOOK') => {
        if (platform === 'INSTAGRAM') setIsSyncingInstagram(true);
        if (platform === 'YOUTUBE') setIsSyncingYoutube(true);
        if (platform === 'FACEBOOK') setIsSyncingFacebook(true);

        try {
            const schoolId = typeof window !== 'undefined' ? localStorage.getItem("selectedSchool") : null;
            const res = await fetch(`/api/social/sync?platform=${platform}`, {
                method: "POST",
                headers: {
                    ...(schoolId && { "x-school-id": schoolId })
                }
            });

            if (res.ok) {
                toast.success(`${platform} feed synced successfully`);
                fetchSettings(); // Refresh to show possible updated state
            } else {
                const err = await res.json();
                toast.error(err.message || `Failed to sync ${platform}`);
            }
        } catch {
            toast.error(`An error occurred during ${platform} sync`);
        } finally {
            if (platform === 'INSTAGRAM') setIsSyncingInstagram(false);
            if (platform === 'YOUTUBE') setIsSyncingYoutube(false);
            if (platform === 'FACEBOOK') setIsSyncingFacebook(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;

        setIsSaving(true);
        try {
            const schoolId = typeof window !== 'undefined' ? localStorage.getItem("selectedSchool") : null;
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(schoolId && { "x-school-id": schoolId })
                },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                toast.success("Settings saved successfully");
            } else {
                toast.error("Failed to save settings");
            }
        } catch {
            toast.error("An error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    const handleExport = () => {
        const schoolId = typeof window !== 'undefined' ? localStorage.getItem("selectedSchool") : null;
        window.location.href = `/api/database/export${schoolId ? `?schoolId=${schoolId}` : ''}`;
    };

    const handleImportClick = () => {
        setShowImportDialog(true);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            setShowImportDialog(false);
            return;
        }

        const confirmMsg = importMode === 'restore'
            ? "WARNING: Restore mode will DELETE existing data for the current school before applying the backup. Are you absolutely sure?"
            : "Merge mode will clone the backup records into your current school alongside existing data without deleting anything. Proceed?";

        if (window.confirm(confirmMsg)) {
            setIsImporting(true);
            const formData = new FormData();
            formData.append("file", file);

            const schoolId = typeof window !== 'undefined' ? localStorage.getItem("selectedSchool") : null;

            try {
                const res = await fetch("/api/database/import", {
                    method: "POST",
                    headers: {
                        "x-import-mode": importMode,
                        ...(schoolId && { "x-school-id": schoolId })
                    },
                    body: formData,
                });

                if (res.ok) {
                    toast.success("Database imported successfully");
                    fetchSettings();
                } else {
                    const err = await res.json();
                    toast.error(err.error || "Failed to import database");
                }
            } catch {
                toast.error("An error occurred during import");
            } finally {
                setIsImporting(false);
                setShowImportDialog(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        } else {
            setShowImportDialog(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    if (isLoading) {
        return <div className="animate-pulse">Loading settings...</div>;
    }

    if (!settings) {
        return <div>Error loading settings. Please check database.</div>;
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold font-playfair">General Settings</h1>
                <p className="text-gray-500">Configure global website information and announcements</p>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {/* School Information */}
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        School Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">School Name</label>
                            <input
                                type="text"
                                value={settings.schoolName}
                                onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Admission Status</label>
                            <div className="flex items-center gap-3 pt-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.admissionOpen}
                                        onChange={(e) => setSettings({ ...settings, admissionOpen: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:inset-s-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    <span className="ms-3 text-sm font-medium text-gray-700">Admissions are Open</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-primary" />
                        Contact Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider leading-none">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    value={settings.contactEmail}
                                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-primary transition-all text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={settings.contactPhone}
                                    onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-primary transition-all text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Physical Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
                                <textarea
                                    rows={2}
                                    value={settings.address}
                                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-primary transition-all text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Announcement Bar */}
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-primary" />
                        Announcement Bar
                    </h2>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Announcement</label>
                        <textarea
                            rows={2}
                            placeholder="Type an announcement to display on the top bar..."
                            value={settings.announcement || ""}
                            onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all text-sm"
                        />
                    </div>
                </div>

                {/* Social Links */}
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-primary" />
                        Social Presence
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Facebook</label>
                            <div className="relative">
                                <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={settings.facebookUrl || ""}
                                    onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-primary transition-all text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Instagram Page URL</label>
                            <div className="relative">
                                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={settings.instagramUrl || ""}
                                    onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-primary transition-all text-sm"
                                    placeholder="https://www.instagram.com/yourpage"
                                />
                            </div>
                        </div>

                        {/* Instagram Feed Integration */}
                        <div className="md:col-span-2 mt-4 p-6 bg-pink-50 rounded-2xl border border-pink-100">
                            <h3 className="text-sm font-bold text-pink-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Instagram className="w-4 h-4" />
                                Instagram Feed Integration
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500">Instagram Access Token</label>
                                    <input
                                        type="password"
                                        value={settings.instagramAccessToken || ""}
                                        onChange={(e) => setSettings({ ...settings, instagramAccessToken: e.target.value })}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-500 transition-all text-sm"
                                        placeholder="Enter Long-Lived Access Token"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500">Instagram User ID</label>
                                    <input
                                        type="text"
                                        value={settings.instagramUserId || ""}
                                        onChange={(e) => setSettings({ ...settings, instagramUserId: e.target.value })}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-500 transition-all text-sm"
                                        placeholder="Enter Instagram User ID"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.instagramEnabled || false}
                                            onChange={(e) => setSettings({ ...settings, instagramEnabled: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-500/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:inset-s-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                                        <span className="ms-3 text-sm font-medium text-gray-700">Enable Instagram Feed</span>
                                    </label>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleSync('INSTAGRAM')}
                                    disabled={isSyncingInstagram || !settings.instagramAccessToken}
                                    className="flex items-center gap-2 bg-white text-pink-600 border border-pink-200 px-6 py-2 rounded-xl hover:bg-pink-600 hover:text-white transition-all text-sm font-bold shadow-sm disabled:opacity-50"
                                >
                                    {isSyncingInstagram ? "Syncing..." : "Sync Instagram Now"}
                                </button>
                            </div>
                        </div>

                        {/* Facebook Feed Integration */}
                        <div className="md:col-span-2 mt-4 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Facebook className="w-4 h-4" />
                                Facebook Feed Integration
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500">Page Access Token</label>
                                    <input
                                        type="password"
                                        value={settings.facebookAccessToken || ""}
                                        onChange={(e) => setSettings({ ...settings, facebookAccessToken: e.target.value })}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                                        placeholder="Enter Page Access Token"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500">Page ID</label>
                                    <input
                                        type="text"
                                        value={settings.facebookPageId || ""}
                                        onChange={(e) => setSettings({ ...settings, facebookPageId: e.target.value })}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                                        placeholder="Enter Facebook Page ID"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.facebookEnabled || false}
                                            onChange={(e) => setSettings({ ...settings, facebookEnabled: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:inset-s-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        <span className="ms-3 text-sm font-medium text-gray-700">Enable Facebook Feed</span>
                                    </label>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleSync('FACEBOOK')}
                                    disabled={isSyncingFacebook || !settings.facebookAccessToken}
                                    className="flex items-center gap-2 bg-white text-blue-600 border border-blue-200 px-6 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-sm font-bold shadow-sm disabled:opacity-50"
                                >
                                    {isSyncingFacebook ? "Syncing..." : "Sync Facebook Now"}
                                </button>
                            </div>
                        </div>

                        {/* YouTube Feed Integration */}
                        <div className="md:col-span-2 mt-4 p-6 bg-red-50 rounded-2xl border border-red-100">
                            <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <YoutubeIcon className="w-4 h-4" />
                                YouTube Feed Integration
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500">YouTube API Key</label>
                                    <input
                                        type="password"
                                        value={settings.youtubeApiKey || ""}
                                        onChange={(e) => setSettings({ ...settings, youtubeApiKey: e.target.value })}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500 transition-all text-sm"
                                        placeholder="Enter Google API Key"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500">Channel ID</label>
                                    <input
                                        type="text"
                                        value={settings.youtubeChannelId || ""}
                                        onChange={(e) => setSettings({ ...settings, youtubeChannelId: e.target.value })}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500 transition-all text-sm"
                                        placeholder="Enter YouTube Channel ID"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.youtubeEnabled || false}
                                            onChange={(e) => setSettings({ ...settings, youtubeEnabled: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-500/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:inset-s-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                        <span className="ms-3 text-sm font-medium text-gray-700">Enable YouTube Feed</span>
                                    </label>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleSync('YOUTUBE')}
                                    disabled={isSyncingYoutube || !settings.youtubeApiKey}
                                    className="flex items-center gap-2 bg-white text-red-600 border border-red-200 px-6 py-2 rounded-xl hover:bg-red-600 hover:text-white transition-all text-sm font-bold shadow-sm disabled:opacity-50"
                                >
                                    {isSyncingYoutube ? "Syncing..." : "Sync YouTube Now"}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">X (Twitter)</label>
                            <div className="relative">
                                <XIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={settings.twitterUrl || ""}
                                    onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-primary transition-all text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">YouTube</label>
                            <div className="relative">
                                <YoutubeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={settings.youtubeUrl || ""}
                                    onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-primary transition-all text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* SEO Settings */}
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-primary" />
                        SEO & Metadata
                    </h2>
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Meta Title</label>
                            <input
                                type="text"
                                value={settings.metaTitle || ""}
                                onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all text-sm"
                                placeholder="Enter page title for SEO"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Meta Description</label>
                            <textarea
                                rows={3}
                                value={settings.metaDescription || ""}
                                onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all text-sm"
                                placeholder="Enter a brief description for search results"
                            />
                        </div>
                    </div>
                </div>

                {/* Integrations */}
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Database className="w-5 h-5 text-primary" />
                        Integrations
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">WhatsApp Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={settings.whatsappNumber || ""}
                                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-primary transition-all text-sm"
                                    placeholder="e.g. +91 9876543210"
                                />
                            </div>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Google Maps Embed URL</label>
                            <textarea
                                rows={2}
                                value={settings.mapEmbedUrl || ""}
                                onChange={(e) => setSettings({ ...settings, mapEmbedUrl: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all text-sm"
                                placeholder="Paste the iframe src URL from Google Maps"
                            />
                        </div>
                    </div>
                </div>

                {/* Hero & Trust Indicators */}
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-primary" />
                        Hero & Trust Indicators
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">CBSE Affiliation Number</label>
                            <input
                                type="text"
                                value={settings.affiliationNo || ""}
                                onChange={(e) => setSettings({ ...settings, affiliationNo: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all text-sm"
                                placeholder="e.g. 1234567"
                            />
                        </div>

                        {/* Trust Item 1 */}
                        <div className="space-y-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <label className="text-xs font-black text-primary uppercase tracking-widest">Indicator 1 (e.g. CBSE)</label>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={settings.trustItem1Text || ""}
                                    onChange={(e) => setSettings({ ...settings, trustItem1Text: e.target.value })}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="Label"
                                />
                                <input
                                    type="text"
                                    value={settings.trustItem1Sub || ""}
                                    onChange={(e) => setSettings({ ...settings, trustItem1Sub: e.target.value })}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="Subtext"
                                />
                            </div>
                        </div>

                        {/* Trust Item 2 */}
                        <div className="space-y-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <label className="text-xs font-black text-primary uppercase tracking-widest">Indicator 2 (e.g. Faculty)</label>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={settings.trustItem2Text || ""}
                                    onChange={(e) => setSettings({ ...settings, trustItem2Text: e.target.value })}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="Label"
                                />
                                <input
                                    type="text"
                                    value={settings.trustItem2Sub || ""}
                                    onChange={(e) => setSettings({ ...settings, trustItem2Sub: e.target.value })}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="Subtext"
                                />
                            </div>
                        </div>

                        {/* Trust Item 3 */}
                        <div className="space-y-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <label className="text-xs font-black text-primary uppercase tracking-widest">Indicator 3 (e.g. Excellence)</label>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={settings.trustItem3Text || ""}
                                    onChange={(e) => setSettings({ ...settings, trustItem3Text: e.target.value })}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="Label"
                                />
                                <input
                                    type="text"
                                    value={settings.trustItem3Sub || ""}
                                    onChange={(e) => setSettings({ ...settings, trustItem3Sub: e.target.value })}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="Subtext"
                                />
                            </div>
                        </div>

                        {/* Trust Item 4 */}
                        <div className="space-y-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <label className="text-xs font-black text-primary uppercase tracking-widest">Indicator 4 (e.g. Growth)</label>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={settings.trustItem4Text || ""}
                                    onChange={(e) => setSettings({ ...settings, trustItem4Text: e.target.value })}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="Label"
                                />
                                <input
                                    type="text"
                                    value={settings.trustItem4Sub || ""}
                                    onChange={(e) => setSettings({ ...settings, trustItem4Sub: e.target.value })}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="Subtext"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Database Management */}
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Database className="w-5 h-5 text-primary" />
                        Database Management
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-800">Export Database</h3>
                                <p className="text-sm text-gray-500">Download a complete backup of the database as a ZIP file.</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleExport}
                                className="flex items-center gap-2 bg-blue-50 text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-100 transition-all font-semibold"
                            >
                                <Download className="w-5 h-5" />
                                Export Database
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-800">Import Database</h3>
                                <p className="text-sm text-gray-500">Upload a database ZIP file to restore data. Warning: This replaces existing data.</p>
                            </div>
                            <input
                                type="file"
                                accept=".zip"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={handleImportClick}
                                disabled={isImporting}
                                className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-xl hover:bg-red-100 transition-all font-semibold disabled:opacity-50"
                            >
                                {isImporting ? (
                                    <div className="w-4 h-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                                ) : (
                                    <Upload className="w-5 h-5" />
                                )}
                                {isImporting ? "Importing..." : "Import Database"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-8 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-primary text-white px-10 py-4 rounded-2xl hover:bg-primary/90 transition-all font-bold shadow-xl shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        Save All Settings
                    </button>
                </div>
            </form>

            <Modal
                isOpen={showImportDialog}
                onClose={() => setShowImportDialog(false)}
                title="Database Import Options"
            >
                <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                        <p className="text-sm text-blue-700 font-medium">
                            Choose how you want to apply the uploaded JSON database files.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-start gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                            <input
                                type="radio"
                                name="importMode"
                                value="restore"
                                checked={importMode === 'restore'}
                                onChange={() => setImportMode('restore')}
                                className="mt-1 w-4 h-4 text-primary focus:ring-primary"
                            />
                            <div>
                                <h4 className="font-bold text-gray-900">Restore (Overwrite)</h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    Wipes existing data for the current school and fully replaces it with the backup. Use this when restoring from a crash.
                                </p>
                            </div>
                        </label>

                        <label className="flex items-start gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                            <input
                                type="radio"
                                name="importMode"
                                value="merge"
                                checked={importMode === 'merge'}
                                onChange={() => setImportMode('merge')}
                                className="mt-1 w-4 h-4 text-primary focus:ring-primary"
                            />
                            <div>
                                <h4 className="font-bold text-gray-900">Merge (Clone & Append)</h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    Safely adds records from your backup as brand new duplicate entries alongside existing data. Safe for importing cross-domain backups.
                                </p>
                            </div>
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => setShowImportDialog(false)}
                            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all font-bold"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowImportDialog(false);
                                fileInputRef.current?.click();
                            }}
                            className="bg-primary text-white px-10 py-3 rounded-xl hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20"
                        >
                            Continue to Upload
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
