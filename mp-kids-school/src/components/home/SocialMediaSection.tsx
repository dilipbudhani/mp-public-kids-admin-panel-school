"use client";
import React, { useState } from 'react';
import { Facebook, Instagram, Youtube, Twitter, Heart, MessageCircle, X } from 'lucide-react';
import Link from 'next/link';

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
        image: string;
        caption: string;
        likes: number;
        comments: number;
    }[];
}

export default function SocialMediaSection({ settings, galleryItems = [] }: SocialMediaSectionProps) {
    const [lightboxImage, setLightboxImage] = useState<{ url: string, caption: string } | null>(null);

    const SOCIAL_PLATFORMS = [
        {
            id: 'instagram',
            name: 'Instagram',
            handle: settings?.instagramUrl?.split('/').pop() ? `@${settings.instagramUrl.split('/').pop()}` : '@mppublicschool',
            followers: '12.4K followers',
            icon: Instagram,
            color: 'text-pink-600',
            link: settings?.instagramUrl || '#'
        },
        {
            id: 'facebook',
            name: 'Facebook',
            handle: settings?.facebookUrl?.split('/').pop() ? `@${settings.facebookUrl.split('/').pop()}` : '@mppublicschool',
            followers: '25K followers',
            icon: Facebook,
            color: 'text-blue-600',
            link: settings?.facebookUrl || '#'
        },
        {
            id: 'youtube',
            name: 'YouTube',
            handle: settings?.youtubeUrl?.split('/').pop() ? `@${settings.youtubeUrl.split('/').pop()}` : '@mppublicschool',
            followers: '8.2K subscribers',
            icon: Youtube,
            color: 'text-red-600',
            link: settings?.youtubeUrl || '#'
        },
        {
            id: 'twitter',
            name: 'Twitter/X',
            handle: settings?.twitterUrl?.split('/').pop() ? `@${settings.twitterUrl.split('/').pop()}` : '@mppublicschool',
            followers: '5.1K followers',
            icon: Twitter,
            color: 'text-neutral-800',
            link: settings?.twitterUrl || '#'
        },
    ].filter(p => p.link !== '#');

    const MARQUEE_CAPTIONS = [
        "Annual Sports Day highlights",
        "Science Exhibition 2025 winners announced!",
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

    if (SOCIAL_PLATFORMS.length === 0 && galleryItems.length === 0) return null;

    return (
        <section className="py-20 bg-neutral-50 relative overflow-hidden">
            <div className="container relative z-10 w-full px-4 text-center mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-primary text-4xl md:text-5xl font-bold font-playfair mb-4">
                        Stay Connected with <span className="text-secondary">{settings?.schoolName || "MP Kids School"}</span>
                    </h2>
                    <p className="text-neutral-600 max-w-2xl mx-auto">
                        Follow us on our social media platforms for the latest updates, event highlights, and glimpses of life at {settings?.schoolName || "MP Kids School"}.
                    </p>
                </div>

                {/* Platform Cards */}
                {SOCIAL_PLATFORMS.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-6xl mx-auto px-4">
                        {SOCIAL_PLATFORMS.map((platform) => (
                            <div key={platform.id} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                                <div className={`w-14 h-14 rounded-full bg-neutral-50 flex items-center justify-center mb-4 ${platform.color}`}>
                                    <platform.icon className="w-7 h-7" />
                                </div>
                                <h3 className="font-bold text-lg text-primary">{platform.name}</h3>
                                <p className="text-sm font-medium text-neutral-500 mb-1">{platform.handle}</p>
                                <p className="text-xs text-neutral-400 mb-6">{platform.followers}</p>
                                <Link href={platform.link} target="_blank" className="mt-auto w-full py-3 px-4 bg-primary text-white hover:bg-secondary hover:text-white font-medium rounded-lg transition-colors text-sm">
                                    Follow
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                {/* Instagram Style Grid */}
                {galleryItems.length > 0 && (
                    <div className="max-w-4xl mx-auto mb-16 px-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                            {galleryItems.map((post) => (
                                <div
                                    key={post.id}
                                    className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg md:rounded-xl bg-neutral-200"
                                    onClick={() => setLightboxImage({ url: post.image, caption: post.caption })}
                                >
                                    <img src={post.image} alt={post.caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                                        <div className="flex items-center gap-6 text-white font-bold mb-4">
                                            <div className="flex items-center gap-2">
                                                <Heart className="w-6 h-6 fill-white text-white" />
                                                <span>{post.likes}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MessageCircle className="w-6 h-6 fill-white text-white" />
                                                <span>{post.comments}</span>
                                            </div>
                                        </div>
                                        <p className="text-white text-sm text-center line-clamp-3 hidden md:block px-4">
                                            {post.caption}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* CSS Marquee Ticker */}
            <div className="relative w-full overflow-hidden bg-primary text-white py-4 border-y border-white/10 flex items-center group">
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
                        className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white transition-colors z-110 p-2 bg-black/50 rounded-full"
                        onClick={(e) => { e.stopPropagation(); setLightboxImage(null); }}
                    >
                        <X className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                    <div
                        className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-lg lg:rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Image Section */}
                        <div className="w-full md:w-3/5 lg:w-2/3 h-[40vh] md:h-auto bg-black flex items-center justify-center relative">
                            <img src={lightboxImage.url} alt={lightboxImage.caption} className="max-w-full max-h-full object-contain" />
                        </div>

                        {/* Details Section */}
                        <div className="w-full md:w-2/5 lg:w-1/3 bg-white flex flex-col h-[50vh] md:h-auto overflow-y-auto">
                            <div className="p-4 flex items-center gap-3 border-b border-neutral-100 shrink-0">
                                <div className="w-10 h-10 rounded-full bg-linear-to-tr from-yellow-400 via-pink-500 to-purple-500 p-[2px]">
                                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                                        <Instagram className="w-5 h-5 text-neutral-800" />
                                    </div>
                                </div>
                                <div className="font-bold text-sm text-primary">
                                    {settings?.instagramUrl?.split('/').pop() ? `@${settings.instagramUrl.split('/').pop()}` : '@mppublicschool'}
                                </div>
                            </div>
                            <div className="p-4 flex-1 overflow-y-auto">
                                <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                                    <span className="font-bold text-primary mr-2">
                                        {settings?.instagramUrl?.split('/').pop() ? settings.instagramUrl.split('/').pop() : 'mppublicschool'}
                                    </span>
                                    {lightboxImage.caption}
                                </p>
                            </div>
                            <div className="p-4 border-t border-neutral-100 shrink-0">
                                <div className="flex gap-4 mb-3">
                                    <Heart className="w-6 h-6 text-neutral-800 cursor-pointer hover:text-red-500 transition-colors" />
                                    <MessageCircle className="w-6 h-6 text-neutral-800 cursor-pointer hover:text-neutral-500 transition-colors" />
                                </div>
                                <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
                                    View on Instagram
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
