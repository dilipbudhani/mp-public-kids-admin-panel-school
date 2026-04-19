import mongoose, { Schema, Document, Model } from 'mongoose';

export enum AdmissionStatus {
    PENDING = 'PENDING',
    REVIEWING = 'REVIEWING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    WAITLISTED = 'WAITLISTED',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
    UNPAID = 'UNPAID',
    PAID = 'PAID',
}

export interface IDocument {
    name: string;
    url: string;
    type: string;
    uploadedAt: Date;
}

export interface IAdmission extends Document {
    schoolId: string;
    applicationNo: string;
    studentName: string;
    dateOfBirth: string;
    gender: string;
    applyingForClass: string;
    academicYear: string;
    fatherName: string;
    motherName: string;
    primaryContact: string;
    alternateContact?: string;
    email: string;
    address: string;
    city: string;
    pincode: string;
    previousSchool?: string;
    previousClass?: string;
    previousStream?: string;
    transferCertificate?: boolean;
    status: AdmissionStatus;
    paymentStatus: PaymentStatus;
    adminNotes?: string;
    reviewedAt?: Date;
    documents: IDocument[];
    createdAt: Date;
    updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>({
    name: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const AdmissionSchema = new Schema<IAdmission>(
    {
        schoolId: { type: String, required: true, index: true },
        applicationNo: { type: String, required: true, unique: true },
        studentName: { type: String, required: true },
        dateOfBirth: { type: String, required: true },
        gender: { type: String, required: true },
        applyingForClass: { type: String, required: true },
        academicYear: { type: String, default: '2026-27' },
        fatherName: { type: String, required: true },
        motherName: { type: String, required: true },
        primaryContact: { type: String, required: true },
        alternateContact: { type: String },
        email: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        pincode: { type: String, required: true },
        previousSchool: { type: String },
        previousClass: { type: String },
        previousStream: { type: String },
        transferCertificate: { type: Boolean, default: false },
        status: {
            type: String,
            enum: Object.values(AdmissionStatus),
            default: AdmissionStatus.PENDING,
        },
        paymentStatus: {
            type: String,
            enum: Object.values(PaymentStatus),
            default: PaymentStatus.PENDING,
        },
        adminNotes: { type: String },
        reviewedAt: { type: Date },
        documents: [DocumentSchema],
    },
    { timestamps: true }
);

const Admission: Model<IAdmission> = mongoose.models.Admission || mongoose.model<IAdmission>('Admission', AdmissionSchema);

export default Admission;
