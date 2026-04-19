import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAlumni extends Document {
    schoolIds: string[];
    name: string;
    batch: number;
    profession: string;
    organization: string;
    city: string;
    quote: string;
    initials: string;
    color: string;
    isActive: boolean;
    displayOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

const AlumniSchema = new Schema<IAlumni>(
    {
        schoolIds: { type: [String], index: true },
        name: { type: String, required: true },
        batch: { type: Number, required: true },
        profession: { type: String, required: true },
        organization: { type: String, required: true },
        city: { type: String, required: true },
        quote: { type: String, required: true },
        initials: { type: String, required: true },
        color: { type: String, required: true },
        isActive: { type: Boolean, default: true },
        displayOrder: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Alumni: Model<IAlumni> = mongoose.models.Alumni || mongoose.model<IAlumni>('Alumni', AlumniSchema);

export default Alumni;
