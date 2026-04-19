import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHeroSlide extends Document {
    schoolIds: string[];
    title: string;
    highlight: string;
    description: string;
    badge: string;
    cta1Text: string;
    cta1Href: string;
    cta2Text: string;
    cta2Href: string;
    imageUrl: string;
    statValue: string;
    statLabel: string;
    displayOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const HeroSlideSchema = new Schema<IHeroSlide>(
    {
        schoolIds: { type: [String], index: true },
        title: { type: String, required: true },
        highlight: { type: String, required: true },
        description: { type: String, required: true },
        badge: { type: String, required: true },
        cta1Text: { type: String, required: true },
        cta1Href: { type: String, required: true },
        cta2Text: { type: String, default: "" },
        cta2Href: { type: String, default: "" },
        imageUrl: { type: String, required: true },
        statValue: { type: String, default: '' },
        statLabel: { type: String, default: '' },
        displayOrder: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const HeroSlide: Model<IHeroSlide> = mongoose.models.HeroSlide || mongoose.model<IHeroSlide>('HeroSlide', HeroSlideSchema);

export default HeroSlide;
