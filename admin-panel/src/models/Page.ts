import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPageSection {
    _id: mongoose.Types.ObjectId;
    type: "hero" | "stats" | "text-image" | "grid-cards" | "testimonials" | "faq" | "faculty" | "gallery" | "news-feed" | "cta" | "video";
    title?: string;
    visible: boolean;
    order: number;
    content: any;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPage extends Document {
    slug: string;
    title: string;
    school: "mp-kids-school" | "mp-public-school" | "both";
    sections: IPageSection[];
    seoData?: {
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string[];
        ogImage?: string;
    };
    publishedAt?: Date;
    isDraft: boolean;
    version: number;
    updatedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const PageSectionSchema = new Schema<IPageSection>(
    {
        type: {
            type: String,
            required: true,
            enum: ["hero", "stats", "text-image", "grid-cards", "testimonials", "faq", "faculty", "gallery", "news-feed", "cta", "video"]
        },
        title: { type: String },
        visible: { type: Boolean, default: true },
        order: { type: Number, required: true },
        content: { type: Schema.Types.Mixed, default: {} }
    },
    { timestamps: true }
);

const PageSchema = new Schema<IPage>(
    {
        slug: { type: String, required: true },
        title: { type: String, required: true },
        school: {
            type: String,
            required: true,
            enum: ["mp-kids-school", "mp-public-school", "both"]
        },
        sections: [PageSectionSchema],
        seoData: {
            metaTitle: { type: String, maxLength: 60 },
            metaDescription: { type: String, maxLength: 160 },
            keywords: [String],
            ogImage: { type: String }
        },
        publishedAt: { type: Date },
        isDraft: { type: Boolean, default: true },
        version: { type: Number, default: 1 },
        updatedBy: { type: Schema.Types.ObjectId, ref: "User" }
    },
    { timestamps: true }
);

// Indexes
PageSchema.index({ school: 1, slug: 1 }, { unique: true });
PageSchema.index({ publishedAt: -1 });
PageSchema.index({ updatedAt: -1 });

const Page: Model<IPage> = mongoose.models.Page || mongoose.model<IPage>("Page", PageSchema);

export default Page;
