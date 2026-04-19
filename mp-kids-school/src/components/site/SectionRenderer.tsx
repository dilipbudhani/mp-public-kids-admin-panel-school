import React from 'react';

interface Section {
    title?: string;
    heading?: string;
    subheading?: string;
    content?: string;
    body?: string;
    image?: string;
    order: number;
}

export default function SectionRenderer({ section, index }: { section: Section, index: number }) {
    const isEven = index % 2 === 0;
    const title = section.title || section.heading;
    const content = section.content || section.body;

    return (
        <section className={index % 2 === 0 ? "py-24 bg-white" : "py-24 bg-slate-50"}>
            <div className="container mx-auto px-4">
                <div className={index % 2 === 0 ? "flex flex-col lg:flex-row items-center gap-16" : "flex flex-col lg:flex-row-reverse items-center gap-16"}>
                    <div className="w-full lg:w-1/2">
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
                        <div
                            className="text-slate-600 text-lg mb-8 leading-relaxed prose prose-slate max-w-none"
                            dangerouslySetInnerHTML={{ __html: content || "" }}
                        />
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
