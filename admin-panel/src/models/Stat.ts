import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStat extends Document {
    schoolIds: string[];
    label: string;
    value: number;
    suffix: string;
    icon?: string;
    displayOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const StatSchema = new Schema<IStat>(
    {
        schoolIds: { type: [String], index: true },
        label: { type: String, required: true },
        value: { type: Number, required: true },
        suffix: { type: String, default: '+' },
        icon: { type: String, default: 'Star' },
        displayOrder: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Stat: Model<IStat> = mongoose.models.Stat || mongoose.model<IStat>('Stat', StatSchema);

export default Stat;
