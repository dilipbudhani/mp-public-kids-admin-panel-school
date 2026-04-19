"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, ZoomIn, Calendar, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export type GalleryCategory = 'All' | 'Sports' | 'Events' | 'Academics' | 'Campus' | 'Others';

interface GalleryItem {
    _id: string;
    title: string;
    imageUrl: string;
    type: 'image' | 'video';
    category: string;
    date: Date;
    thumbnailUrl?: string;
}

interface GalleryViewProps {
    initialItems: GalleryItem[];
}

const CATEGORIES: GalleryCategory[] = ['All', 'Sports', 'Events', 'Academics', 'Campus', 'Others'];

export default function GalleryView({ initialItems }: GalleryViewProps) {
    const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('All');
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

    const filteredItems = useMemo(() => {
        if (selectedCategory === 'All') return initialItems;
        return initialItems.filter(item => item.category === selectedCategory);
    }, [initialItems, selectedCategory]);

    // Helper to get YouTube Embed URL
    const getYouTubeEmbedUrl = (url: string) => {
        if (!url) return '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : url;
    };

    return (
        <section className="py-20 bg-surface">
            <div className="container mx-auto px-4">
                {/* Filter Controls */}
                <div className="flex flex-wrap justify-center gap-3 mb-16 -mt-24 relative z-20">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300",
                                selectedCategory === cat
                                    ? "bg-primary text-white shadow-xl shadow-primary/20 scale-105"
                                    : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100 hover:border-primary/20"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredItems.map((item) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4, ease: "circOut" }}
                                className="group cursor-pointer"
                                onClick={() => setSelectedItem(item)}
                            >
                                <div className="relative aspect-video rounded-5xl overflow-hidden bg-slate-200 border-4 border-white shadow-lg group-hover:shadow-2xl transition-all duration-500">
                                    <Image
                                        src={item.type === 'video' ? (item.thumbnailUrl || '/images/video-placeholder.jpg') : item.imageUrl}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                                            {item.type === 'video' ? <Play className="w-8 h-8 fill-current" /> : <ZoomIn className="w-8 h-8" />}
                                        </div>
                                    </div>

                                    {/* Badge */}
                                    <div className="absolute top-6 left-6 flex gap-2">
                                        <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-black text-primary uppercase tracking-widest">
                                            {item.category}
                                        </span>
                                        {item.type === 'video' && (
                                            <span className="px-4 py-1.5 rounded-full bg-red-600/90 backdrop-blur-sm text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                                                <Play className="w-3 h-3 fill-current" /> Video
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 px-4">
                                    <div className="flex items-center gap-3 text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-2">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <h3 className="text-xl font-serif font-bold text-primary group-hover:text-accent transition-colors duration-300">
                                        {item.title}
                                    </h3>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                {filteredItems.length === 0 && (
                    <div className="py-32 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Tag className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-serif font-bold mb-2 text-slate-300">No items found</h3>
                        <p className="text-slate-400">Try selecting a different category or check back later.</p>
                    </div>
                )}
            </div>

            {/* Lightbox / Video Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-12"
                    >
                        <div
                            className="absolute inset-0 bg-primary/95 backdrop-blur-xl cursor-crosshair"
                            onClick={() => setSelectedItem(null)}
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-6xl aspect-video rounded-6xl overflow-hidden border border-white/10 shadow-2xl bg-black"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-8 right-8 z-20 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {selectedItem.type === 'video' ? (
                                <iframe
                                    src={getYouTubeEmbedUrl(selectedItem.imageUrl)}
                                    className="w-full h-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <Image
                                    src={selectedItem.imageUrl}
                                    alt={selectedItem.title}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            )}

                            {/* Info Bar */}
                            <div className="absolute bottom-0 inset-x-0 p-8 md:p-12 bg-linear-to-t from-black/80 via-black/40 to-transparent">
                                <div className="flex items-center gap-4 mb-3">
                                    <span className="px-4 py-1.5 rounded-full bg-secondary text-primary text-[10px] font-black uppercase tracking-widest">
                                        {selectedItem.category}
                                    </span>
                                    <span className="text-slate-400 text-xs font-mono">
                                        {new Date(selectedItem.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-serif font-bold text-white uppercase tracking-wider">
                                    {selectedItem.title}
                                </h2>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
