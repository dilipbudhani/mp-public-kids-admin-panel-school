import React from "react";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaUrl?: string;
    imageUrl?: string;
}

export function HeroSection({ title, subtitle, ctaText, ctaUrl, imageUrl }: HeroSectionProps) {
    return (
        <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-slate-900 group">
            {imageUrl ? (
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 group-hover:scale-105"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-900/80" />
                </div>
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-indigo-950" />
            )}

            <div className="relative container mx-auto px-6 text-center z-10 text-white">
                <div className="max-w-4xl mx-auto space-y-8">
                    {title && (
                        <h1 className="text-5xl md:text-7xl font-black font-playfair leading-tight animate-in fade-in slide-in-from-bottom-10 duration-700">
                            {title}
                        </h1>
                    )}
                    {subtitle && (
                        <p className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-700 delay-100">
                            {subtitle}
                        </p>
                    )}
                    {ctaText && (
                        <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
                            <a
                                href={ctaUrl || "#"}
                                className="inline-flex items-center px-10 py-5 bg-primary text-white font-black rounded-full text-sm uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-2xl shadow-primary/20"
                            >
                                {ctaText}
                            </a>
                        </div>
                    )}
                </div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
                    <div className="w-1 h-2 bg-white/40 rounded-full" />
                </div>
            </div>
        </section>
    );
}

export function TextBlock({ heading, content }: { heading?: string; content?: string }) {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6 max-w-4xl">
                {heading && (
                    <h2 className="text-4xl font-black font-playfair text-slate-900 mb-8 border-l-8 border-primary pl-8">
                        {heading}
                    </h2>
                )}
                {content && (
                    <div className="prose prose-xl prose-slate max-w-none font-medium leading-relaxed text-slate-600">
                        {content.split('\n').map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export function ImageAndText({ heading, text, imageUrl, imagePosition = "left" }: { heading?: string; text?: string; imageUrl?: string; imagePosition?: string }) {
    return (
        <section className="py-24 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className={cn(
                    "flex flex-col md:flex-row items-center gap-16",
                    imagePosition === "right" ? "md:flex-row-reverse" : ""
                )}>
                    <div className="flex-1 w-full relative">
                        <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200 border-8 border-white">
                            <img
                                src={imageUrl || "/api/placeholder/800/600"}
                                alt={heading}
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                        </div>
                    </div>
                    <div className="flex-1 space-y-6">
                        <h2 className="text-4xl md:text-5xl font-black font-playfair text-slate-900 leading-tight">
                            {heading}
                        </h2>
                        <div className="text-xl text-slate-600 font-medium leading-relaxed">
                            {text}
                        </div>
                        <div className="pt-4">
                            <button className="text-primary font-black uppercase tracking-widest text-sm flex items-center gap-2 group">
                                Learn More
                                <span className="w-8 h-[2px] bg-primary transition-all group-hover:w-12" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
