import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAlumniEvent extends Document {
    schoolIds: string[];
    name: string;
    date: string;
    location: string;
    type: string; // 'In-Person' | 'Online'
    description: string;
    color: string;
    isActive: boolean;
    displayOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

const AlumniEventSchema = new Schema<IAlumniEvent>(
    {
        schoolIds: { type: [String], index: true },
        name: { type: String, required: true },
        date: { type: String, required: true },
        location: { type: String, required: true },
        type: { type: String, default: 'In-Person' },
        description: { type: String, required: true },
        color: { type: String, default: '#3B82F6' },
        isActive: { type: Boolean, default: true },
        displayOrder: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const AlumniEvent: Model<IAlumniEvent> =
    mongoose.models.AlumniEvent ||
    mongoose.model<IAlumniEvent>('AlumniEvent', AlumniEventSchema);

export default AlumniEvent;
