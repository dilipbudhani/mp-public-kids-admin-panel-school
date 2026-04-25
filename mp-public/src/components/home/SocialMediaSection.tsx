"use client";
import React, { useState } from 'react';
import { Facebook, Instagram, Heart, MessageCircle, X, Youtube } from 'lucide-react';
import Link from 'next/link';
import { XIcon, YoutubeIcon } from "@/components/ui/Icons";

interface SocialMediaSectionProps {
    settings?: {
        facebookUrl?: string;
        instagramUrl?: string;
        twitterUrl?: string;
        youtubeUrl?: string;
        [key: string]: any;
    } | null;
    galleryItems?: {
        id: string;
        platform?: 'INSTAGRAM' | 'YOUTUBE' | 'FACEBOOK';
        image: string;
        thumbnail?: string;
        caption: string;
        likes: number;
        comments: number;
        type?: string;
        permalink?: string;
    }[];
}

export default function SocialMediaSection({ settings, galleryItems = [] }: SocialMediaSectionProps) {
    const [lightboxImage, setLightboxImage] = useState<{ url: string, caption: string, platform?: string, permalink?: string } | null>(null);
    const [selectedTab, setSelectedTab] = useState<'INSTAGRAM' | 'YOUTUBE' | 'FACEBOOK'>('INSTAGRAM');

    const PLATFORMS_CONFIG = {
        INSTAGRAM: {
            id: 'INSTAGRAM',
            name: 'Instagram',
            icon: Instagram,
            color: 'text-pink-600',
            bgColor: 'bg-pink-50',
            borderColor: 'border-pink-200',
            activeBg: 'bg-pink-600',
            link: settings?.instagramUrl
        },
        FACEBOOK: {
            id: 'FACEBOOK',
            name: 'Facebook',
            icon: Facebook,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            activeBg: 'bg-blue-600',
            link: settings?.facebookUrl
        },
        YOUTUBE: {
            id: 'YOUTUBE',
            name: 'YouTube',
            icon: Youtube,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            activeBg: 'bg-red-600',
            link: settings?.youtubeUrl
        }
    };

    const tabs = (Object.keys(PLATFORMS_CONFIG) as Array<keyof typeof PLATFORMS_CONFIG>).filter(key => {
        // Show tab if we have posts for it OR if we have a URL for it
        const hasPosts = galleryItems.some(item => item.platform === key);
        const hasUrl = !!PLATFORMS_CONFIG[key].link;
        return hasPosts || hasUrl;
    });

    const filteredItems = galleryItems.filter(item => item.platform === selectedTab);

    // If current tab has no items but another one does, switch to the first one with items
    React.useEffect(() => {
        if (filteredItems.length === 0 && galleryItems.length > 0) {
            const firstWithItems = tabs.find(t => galleryItems.some(item => item.platform === t));
            if (firstWithItems) setSelectedTab(firstWithItems);
        }
    }, [galleryItems]);

    const MARQUEE_CAPTIONS = [
        "Annual Sports Day highlights",
        "Science Exhibition winners announced!",
        "Congratulations to our Board toppers!",
        "Admissions open for 2026-27",
        "Join our robotics workshop next weekend",
        "Parent-Teacher meeting scheduled for Saturday"
    ];

    // Disable scrolling when modal is open
    React.useEffect(() => {
        if (lightboxImage) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [lightboxImage]);

    if (tabs.length === 0 && galleryItems.length === 0) return null;

    return (
        <section className="py-20 bg-neutral-50 relative overflow-hidden">
            <div className="container relative z-10 w-full px-4 text-center mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-primary text-4xl md:text-5xl font-bold font-playfair mb-4">
                        Our <span className="text-secondary">Social Feed</span>
                    </h2>
                    <p className="text-neutral-600 max-w-2xl mx-auto">
                        Follow our official handles for daily updates, event highlights and student achievements.
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {tabs.map((tabId) => {
                        const config = PLATFORMS_CONFIG[tabId];
                        const isActive = selectedTab === tabId;
                        return (
                            <button
                                key={tabId}
                                onClick={() => setSelectedTab(tabId)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${isActive
                                    ? `${config.activeBg} text-white shadow-lg scale-105`
                                    : 'bg-white text-neutral-500 hover:bg-neutral-100 border border-neutral-200'
                                    }`}
                            >
                                <config.icon className="w-5 h-5" />
                                {config.name}
                            </button>
                        );
                    })}
                </div>

                {/* Grid */}
                <div className="max-w-6xl mx-auto mb-16 px-4">
                    {filteredItems.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredItems.map((post) => (
                                <div
                                    key={post.id}
                                    className="relative aspect-square group cursor-pointer overflow-hidden rounded-xl bg-neutral-200 shadow-sm"
                                    onClick={() => setLightboxImage({
                                        url: post.image,
                                        caption: post.caption,
                                        platform: post.platform,
                                        permalink: post.permalink
                                    })}
                                >
                                    {/* Video/Reel Indicator */}
                                    {(post.type?.includes('VIDEO') || selectedTab === 'YOUTUBE') && (
                                        <div className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-lg z-10 backdrop-blur-sm">
                                            <Youtube className="w-4 h-4 fill-white" />
                                        </div>
                                    )}

                                    <img
                                        src={post.thumbnail || post.image}
                                        alt={post.caption}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-white">
                                        <div className="flex items-center gap-6 font-bold mb-4">
                                            <div className="flex items-center gap-2">
                                                <Heart className="w-6 h-6 fill-white" />
                                                <span>{post.likes}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MessageCircle className="w-6 h-6 fill-white" />
                                                <span>{post.comments}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-center line-clamp-3 px-2">
                                            {post.caption}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 bg-white rounded-3xl border border-dashed border-neutral-300">
                            <p className="text-neutral-400 font-medium italic">No posts found for this platform yet.</p>
                            {PLATFORMS_CONFIG[selectedTab].link && (
                                <Link
                                    href={PLATFORMS_CONFIG[selectedTab].link || '#'}
                                    target="_blank"
                                    className={`mt-4 inline-flex items-center gap-2 font-bold ${PLATFORMS_CONFIG[selectedTab].color}`}
                                >
                                    View Page Directly <X className="w-4 h-4 rotate-45" />
                                </Link>
                            )}
                        </div>
                    )}
                </div>

                <Link
                    href={PLATFORMS_CONFIG[selectedTab].link || '#'}
                    target="_blank"
                    className={`inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all shadow-xl hover:-translate-y-1 ${PLATFORMS_CONFIG[selectedTab].activeBg} text-white`}
                >
                    Visit our {PLATFORMS_CONFIG[selectedTab].name}
                    <X className="w-5 h-5 rotate-45" />
                </Link>
            </div>

            {/* Marquee Ticker */}
            <div className="mt-20 relative w-full overflow-hidden bg-primary text-white py-4 flex items-center group">
                <div className="flex animate-marquee-fast group-hover:[animation-play-state:paused]">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex items-center gap-12 whitespace-nowrap px-6">
                            {MARQUEE_CAPTIONS.map((caption, idx) => (
                                <div key={`idx-${i}-${idx}`} className="flex items-center gap-4 text-sm font-medium tracking-wide">
                                    <span className="w-2 h-2 rounded-full bg-secondary shrink-0"></span>
                                    {caption}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <style>{`
                    @keyframes marquee-fast {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .animate-marquee-fast {
                        animation: marquee-fast 30s linear infinite;
                    }
                `}</style>
            </div>

            {/* Lightbox Modal */}
            {lightboxImage && (
                <div className="fixed inset-0 z-100 bg-black/95 flex items-center justify-center p-4 md:p-8 backdrop-blur-sm" onClick={() => setLightboxImage(null)}>
                    <button
                        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-110 p-2 bg-black/50 rounded-full"
                        onClick={(e) => { e.stopPropagation(); setLightboxImage(null); }}
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div
                        className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Media Section */}
                        <div className="w-full md:w-3/5 lg:w-2/3 h-[40vh] md:h-auto bg-black flex items-center justify-center relative">
                            {lightboxImage.platform === 'YOUTUBE' ? (
                                <iframe
                                    src={`https://www.youtube.com/embed/${lightboxImage.url.split('v=')[1] || lightboxImage.url.split('/').pop()}`}
                                    className="w-full h-full"
                                    allowFullScreen
                                />
                            ) : (
                                <img src={lightboxImage.url} alt={lightboxImage.caption} className="max-w-full max-h-full object-contain" />
                            )}
                        </div>

                        {/* Info Section */}
                        <div className="w-full md:w-2/5 lg:w-1/3 bg-white flex flex-col h-[50vh] md:h-auto">
                            <div className="p-4 flex items-center gap-3 border-b border-neutral-100 shrink-0">
                                {lightboxImage.platform === 'INSTAGRAM' && <Instagram className="w-5 h-5 text-pink-600" />}
                                {lightboxImage.platform === 'FACEBOOK' && <Facebook className="w-5 h-5 text-blue-600" />}
                                {lightboxImage.platform === 'YOUTUBE' && <Youtube className="w-5 h-5 text-red-600" />}
                                <div className="font-bold text-sm text-primary">MP School Feed</div>
                            </div>
                            <div className="p-6 flex-1 overflow-y-auto">
                                <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                                    {lightboxImage.caption}
                                </p>
                            </div>
                            <div className="p-6 border-t border-neutral-100 shrink-0">
                                <Link
                                    href={lightboxImage.permalink || "#"}
                                    target="_blank"
                                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white transition-all ${lightboxImage.platform === 'INSTAGRAM' ? 'bg-pink-600' :
                                        lightboxImage.platform === 'FACEBOOK' ? 'bg-blue-600' : 'bg-red-600'
                                        }`}
                                >
                                    View on {lightboxImage.platform}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
