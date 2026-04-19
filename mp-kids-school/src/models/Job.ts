import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IJob extends Document {
    schoolIds: string[];
    title: string;
    department: string;
    category: 'Teaching' | 'Non-Teaching' | 'Admin';
    experience: string;
    qualification: string;
    type: 'Full-time' | 'Part-time';
    location: string;
    vacancies: number;
    isActive: boolean;
    displayOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
    {
        schoolIds: { type: [String], index: true },
        title: { type: String, required: true },
        department: { type: String, required: true },
        category: {
            type: String,
            enum: ['Teaching', 'Non-Teaching', 'Admin'],
            required: true
        },
        experience: { type: String, required: true },
        qualification: { type: String, required: true },
        type: {
            type: String,
            enum: ['Full-time', 'Part-time'],
            default: 'Full-time'
        },
        location: { type: String, required: true },
        vacancies: { type: Number, default: 1 },
        isActive: { type: Boolean, default: true },
        displayOrder: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);

export default Job;
