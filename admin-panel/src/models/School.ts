import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISchool extends Document<string> {
    _id: string;
    name: string;
    domain: string;
    logo?: string;
    themeColor?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const SchoolSchema = new Schema<ISchool>(
    {
        _id: { type: String, required: true }, // Using string ID like 'mp-kids-school'
        name: { type: String, required: true },
        domain: { type: String },
        logo: { type: String },
        themeColor: { type: String, default: '#000000' },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const School: Model<ISchool> = mongoose.models.School || mongoose.model<ISchool>('School', SchoolSchema);

export default School;
