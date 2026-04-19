import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITestimonial extends Document {
    schoolIds: string[];
    name: string;
    role: string; // e.g., 'Parent', 'Student', 'Alumni'
    content: string;
    rating: number; // 1-5
    avatarUrl?: string;
    isActive: boolean;
    displayOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
    {
        schoolIds: { type: [String], index: true },
        name: { type: String, required: true },
        role: { type: String, required: true },
        content: { type: String, required: true },
        rating: { type: Number, default: 5, min: 1, max: 5 },
        avatarUrl: { type: String },
        isActive: { type: Boolean, default: true },
        displayOrder: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Testimonial: Model<ITestimonial> = mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);

export default Testimonial;
