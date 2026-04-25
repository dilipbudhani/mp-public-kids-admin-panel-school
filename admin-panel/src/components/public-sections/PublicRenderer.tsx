import React from "react";
import { HeroSection, TextBlock, ImageAndText } from "./BasicSections";

interface SectionData {
    _id: string;
    type: string;
    content: any;
    order: number;
}

interface PublicRendererProps {
    sections: SectionData[];
}

export default function PublicRenderer({ sections }: PublicRendererProps) {
    const sortedSections = [...sections].sort((a, b) => a.order - b.order);

    return (
        <div className="flex flex-col w-full">
            {sortedSections.map((section) => {
                const { type, content, _id } = section;

                switch (type) {
                    case "hero-section":
                        return <HeroSection key={_id} {...content} />;
                    case "text-block":
                        return <TextBlock key={_id} {...content} />;
                    case "image-and-text":
                        return <ImageAndText key={_id} {...content} />;
                    default:
                        console.warn(`Unknown section type: ${type}`);
                        return null;
                }
            })}
        </div>
    );
}
