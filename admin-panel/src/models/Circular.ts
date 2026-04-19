import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICircular extends Document {
    schoolIds: string[];
    title: string;
    date: Date;
    category: string;
    description: string;
    pdfUrl?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CircularSchema = new Schema<ICircular>(
    {
        schoolIds: { type: [String], index: true },
        title: { type: String, required: true },
        date: { type: Date, default: Date.now },
        category: { type: String, required: true },
        description: { type: String, required: true },
        pdfUrl: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Circular: Model<ICircular> = mongoose.models.Circular || mongoose.model<ICircular>('Circular', CircularSchema);

export default Circular;
