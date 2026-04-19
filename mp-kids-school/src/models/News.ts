import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INews extends Document {
    schoolIds: string[];
    title: string;
    slug: string;
    date: Date;
    category: string;
    content: string;
    summary: string;
    imageUrl?: string;
    isFeatured: boolean;
    isPublished: boolean;
    showPopup: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const NewsSchema = new Schema<INews>(
    {
        schoolIds: { type: [String], index: true },
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        date: { type: Date, default: Date.now },
        category: { type: String, required: true },
        content: { type: String, required: true },
        summary: { type: String, required: true },
        imageUrl: { type: String },
        isFeatured: { type: Boolean, default: false },
        isPublished: { type: Boolean, default: true },
        showPopup: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const News: Model<INews> = mongoose.models.News || mongoose.model<INews>('News', NewsSchema);

export default News;
