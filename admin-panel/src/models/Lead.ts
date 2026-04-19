import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILead extends Document {
    schoolId: string;
    name: string;
    email?: string;
    phone: string;
    enquiryType: string;
    message: string;
    source: string;
    status: 'New' | 'Contacted' | 'Converted' | 'Closed';
    priority: 'Low' | 'Medium' | 'High';
    relation?: string;
    classBatch?: string;
    rating?: number;
    assignedTo?: string;
    followUpDate?: Date;
    adminNotes?: string;
    resolvedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
    {
        schoolId: { type: String, required: true, index: true },
        name: { type: String, required: true },
        email: { type: String },
        phone: { type: String, required: true },
        enquiryType: { type: String, required: true },
        message: { type: String, required: true },
        source: { type: String, default: 'contact_form' },
        status: { type: String, enum: ['New', 'Contacted', 'Converted', 'Closed'], default: 'New' },
        priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
        relation: { type: String },
        classBatch: { type: String },
        rating: { type: Number },
        assignedTo: { type: String },
        followUpDate: { type: Date },
        adminNotes: { type: String },
        resolvedAt: { type: Date },
    },
    { timestamps: true }
);

const Lead: Model<ILead> = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;
