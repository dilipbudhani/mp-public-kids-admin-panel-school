import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDisclosure extends Document {
    schoolIds: string[];
    section: 'GENERAL' | 'DOCUMENTS' | 'RESULT_10' | 'RESULT_12' | 'STAFF' | 'INFRASTRUCTURE' | 'FEE';
    label: string;
    value: string;
    value2?: string; // For result tables
    value3?: string; // For result tables
    value4?: string; // For result tables
    link?: string;   // For documents
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const DisclosureSchema = new Schema<IDisclosure>(
    {
        schoolIds: { type: [String], index: true },
        section: {
            type: String,
            required: true,
            enum: ['GENERAL', 'DOCUMENTS', 'RESULT_10', 'RESULT_12', 'STAFF', 'INFRASTRUCTURE', 'FEE']
        },
        label: { type: String, required: true },
        value: { type: String, required: true },
        value2: { type: String },
        value3: { type: String },
        value4: { type: String },
        link: { type: String },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Disclosure: Model<IDisclosure> = mongoose.models.Disclosure || mongoose.model<IDisclosure>('Disclosure', DisclosureSchema);

export default Disclosure;
