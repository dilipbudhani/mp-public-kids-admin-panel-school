"use client";

import React, { useState, useEffect } from "react";
import { Save, Phone, Mail, MapPin, Globe, Facebook, Instagram, Bell, Shield, Database } from "lucide-react";
import { toast } from "sonner";
import { Youtube as YoutubeIcon, Twitter as XIcon } from "lucide-react";

interface SiteSettings {
    _id: string;
    schoolName: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    facebookUrl: string | null;
    instagramUrl: string | null;
    twitterUrl: string | null;
    youtubeUrl: string | null;
    admissionOpen: boolean;
    announcement: string | null;
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    whatsappNumber?: string;
    mapEmbedUrl?: string;
}

export default function SettingsAdminPage() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/settings");
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch {
            toast.error("Failed to fetch settings");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;

        setIsSaving(true);
        try {
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
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
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Instagram</label>
                            <div className="relative">
                                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={settings.instagramUrl || ""}
                                    onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-primary transition-all text-sm"
                                />
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
        </div>
    );
}
