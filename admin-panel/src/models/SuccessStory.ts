import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISuccessStory extends Document {
    schoolIds: string[];
    name: string;
    batch: string;
    category: string;
    headline: string;
    summary: string;
    story: string;
    initials: string;
    color: string;
    isActive: boolean;
    displayOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

const SuccessStorySchema = new Schema<ISuccessStory>(
    {
        schoolIds: { type: [String], index: true },
        name: { type: String, required: true },
        batch: { type: String, required: true },
        category: { type: String, required: true },
        headline: { type: String, required: true },
        summary: { type: String, required: true },
        story: { type: String, required: true },
        initials: { type: String, required: true },
        color: { type: String, required: true },
        isActive: { type: Boolean, default: true },
        displayOrder: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const SuccessStory: Model<ISuccessStory> = mongoose.models.SuccessStory || mongoose.model<ISuccessStory>('SuccessStory', SuccessStorySchema);

export default SuccessStory;
