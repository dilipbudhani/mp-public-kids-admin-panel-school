import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAchievement extends Document {
    schoolIds: string[];
    studentName: string;
    class: string;
    year: string;
    marks: string;
    position?: string;
    image?: string;
    category: 'Class X' | 'Class XII' | 'Sports' | 'Other';
    displayOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AchievementSchema = new Schema<IAchievement>(
    {
        schoolIds: { type: [String], index: true },
        studentName: { type: String, required: true },
        class: { type: String, required: true },
        year: { type: String, required: true },
        marks: { type: String, required: true },
        position: { type: String },
        image: { type: String },
        category: {
            type: String,
            enum: ['Class X', 'Class XII', 'Sports', 'Other'],
            default: 'Class X'
        },
        displayOrder: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Achievement: Model<IAchievement> = mongoose.models.Achievement || mongoose.model<IAchievement>('Achievement', AchievementSchema);

export default Achievement;
