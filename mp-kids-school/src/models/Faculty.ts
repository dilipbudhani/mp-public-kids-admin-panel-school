import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFaculty extends Document {
    schoolIds: string[];
    name: string;
    designation: string;
    department?: string;
    qualification?: string;
    experience?: string;
    imageUrl?: string;
    bio?: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const FacultySchema = new Schema<IFaculty>(
    {
        schoolIds: { type: [String], index: true },
        name: { type: String, required: true },
        designation: { type: String, required: true },
        department: { type: String },
        qualification: { type: String },
        experience: { type: String },
        imageUrl: { type: String },
        bio: { type: String },
        order: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Faculty: Model<IFaculty> = mongoose.models.Faculty || mongoose.model<IFaculty>('Faculty', FacultySchema);

export default Faculty;
