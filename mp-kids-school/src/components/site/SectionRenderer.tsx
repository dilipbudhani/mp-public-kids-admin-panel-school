import React from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from "@/lib/utils";

interface Section {
    title?: string;
    heading?: string;
    subheading?: string;
    content?: string;
    body?: string;
    image?: string;
    order: number;
    items?: any[];
    key?: string;
}

export default function SectionRenderer({ section, index }: { section: Section, index: number }) {
    const isEven = index % 2 === 0;
    const title = section.title || section.heading;
    const content = section.content || section.body;

    return (
        <section className={cn("py-24", index % 2 === 0 ? "bg-white" : "bg-slate-50")}>
            <div className="container mx-auto px-4">
                <div className={cn(
                    "flex flex-col gap-16",
                    section.image ? (isEven ? "lg:flex-row" : "lg:flex-row-reverse") : "w-full text-center"
                )}>
                    <div className={cn(section.image ? "w-full lg:w-1/2" : "w-full max-w-4xl mx-auto")}>
                        {section.subheading && (
                            <span className="text-secondary font-black uppercase tracking-widest text-[10px] mb-4 inline-block">
                                {section.subheading}
                            </span>
                        )}
                        {title && (
                            <h2 className="text-4xl font-serif text-accent font-bold mb-8 italic">
                                {title}
                            </h2>
                        )}
                        {content && (
                            <div className="text-slate-600 text-lg mb-8 leading-relaxed prose prose-slate max-w-none">
                                <ReactMarkdown>{content}</ReactMarkdown>
                            </div>
                        )}

                        {/* Rendering Structured Items (Grid) */}
                        {section.items && section.items.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                                {section.items.map((item: any, i: number) => (
                                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                        {item.icon && <div className="text-primary mb-4">{item.icon}</div>}
                                        {item.title && <h4 className="font-bold text-accent mb-2">{item.title}</h4>}
                                        {item.content && <p className="text-sm text-slate-500 leading-relaxed">{item.content}</p>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {section.image && (
                        <div className="w-full lg:w-1/2 relative h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
                            <img
                                src={section.image}
                                alt={title || "Section image"}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
