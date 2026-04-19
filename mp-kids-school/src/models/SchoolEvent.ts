import mongoose, { Schema, Document, Model } from 'mongoose';

export type EventType = 'Exam' | 'Holiday' | 'Event' | 'PTM' | 'Result' | 'Celebration' | 'Competition' | 'Meeting';

export interface ISchoolEvent extends Document {
    schoolIds: string[];
    title: string;
    date: Date;
    endDate?: Date;
    type: string;
    category: string;
    description?: string;
    location?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const SchoolEventSchema = new Schema<ISchoolEvent>(
    {
        schoolIds: { type: [String], index: true },
        title: { type: String, required: true },
        date: { type: Date, required: true },
        endDate: { type: Date },
        type: { type: String, default: 'Academic' },
        category: {
            type: String,
            required: true,
            enum: ['Holiday', 'Exam', 'Event', 'Celebration', 'Competition', 'Meeting'],
            default: 'Event'
        },
        description: { type: String },
        location: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const SchoolEvent: Model<ISchoolEvent> = mongoose.models.SchoolEvent || mongoose.model<ISchoolEvent>('SchoolEvent', SchoolEventSchema);

export default SchoolEvent;
