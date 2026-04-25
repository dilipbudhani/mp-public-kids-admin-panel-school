import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAlumniTestimonial extends Document {
    schoolIds: string[];
    name: string;
    batch: number;
    designation: string;
    quote: string;
    isActive: boolean;
    displayOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

const AlumniTestimonialSchema = new Schema<IAlumniTestimonial>(
    {
        schoolIds: { type: [String], index: true },
        name: { type: String, required: true },
        batch: { type: Number, required: true },
        designation: { type: String, required: true },
        quote: { type: String, required: true },
        isActive: { type: Boolean, default: true },
        displayOrder: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const AlumniTestimonial: Model<IAlumniTestimonial> =
    mongoose.models.AlumniTestimonial ||
    mongoose.model<IAlumniTestimonial>('AlumniTestimonial', AlumniTestimonialSchema);

export default AlumniTestimonial;
