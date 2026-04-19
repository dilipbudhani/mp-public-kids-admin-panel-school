import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFeeHead {
    head: string;
    amount: string;
    frequency: string;
    notes?: string;
}

export interface IFeeCategory {
    id: string;
    label: string;
    fees: IFeeHead[];
}

export interface ITransportZone {
    zone: string;
    area: string;
    fee: string;
}

export interface IPaymentMethod {
    name: string;
    iconName: string; // Lucide icon name
    color: string;
    bg: string;
    note: string;
}

export interface IFeeStructure extends Document {
    schoolIds: string[];
    categories: IFeeCategory[];
    transportZones: ITransportZone[];
    paymentMethods: IPaymentMethod[];
    importantNotes: { title: string; text: string }[];
    academicYear: string;
    updatedAt: Date;
}

const FeeHeadSchema = new Schema({
    head: { type: String, required: true },
    amount: { type: String, required: true },
    frequency: { type: String, required: true },
    notes: { type: String },
});

const FeeCategorySchema = new Schema({
    id: { type: String, required: true },
    label: { type: String, required: true },
    fees: [FeeHeadSchema],
});

const TransportZoneSchema = new Schema({
    zone: { type: String, required: true },
    area: { type: String, required: true },
    fee: { type: String, required: true },
});

const PaymentMethodSchema = new Schema({
    name: { type: String, required: true },
    iconName: { type: String, required: true },
    color: { type: String, required: true },
    bg: { type: String, required: true },
    note: { type: String, required: true },
});

const FeeStructureSchema = new Schema<IFeeStructure>(
    {
        schoolIds: { type: [String], index: true },
        categories: [FeeCategorySchema],
        transportZones: [TransportZoneSchema],
        paymentMethods: [PaymentMethodSchema],
        importantNotes: [
            {
                title: { type: String, required: true },
                text: { type: String, required: true },
            },
        ],
        academicYear: { type: String, default: '2025-26' },
    },
    { timestamps: true }
);

const FeeStructure: Model<IFeeStructure> = mongoose.models.FeeStructure || mongoose.model<IFeeStructure>('FeeStructure', FeeStructureSchema);

export default FeeStructure;
