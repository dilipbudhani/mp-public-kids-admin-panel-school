import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStaticPage extends Document {
    schoolIds: string[];
    title: string;
    description?: string;
    subtitle?: string;
    slug: string; // e.g., 'about-us', 'academics'
    bannerImage?: string;
    content: any; // Can be string (Markdown/HTML) or array of blocks/sections
    sections: any[];
    metaTitle?: string;
    metaDescription?: string;
    createdAt: Date;
    updatedAt: Date;
}

const StaticPageSchema = new Schema<IStaticPage>(
    {
        schoolIds: { type: [String], index: true },
        title: { type: String, required: true },
        description: { type: String },
        subtitle: { type: String },
        slug: { type: String, required: true },
        bannerImage: { type: String },
        content: { type: Schema.Types.Mixed }, // String or Object Array
        sections: [{ type: Schema.Types.Mixed }], // Array of flexible objects
        metaTitle: { type: String },
        metaDescription: { type: String },
    },
    { timestamps: true }
);

const StaticPage: Model<IStaticPage> = mongoose.models.StaticPage || mongoose.model<IStaticPage>('StaticPage', StaticPageSchema);

export default StaticPage;
