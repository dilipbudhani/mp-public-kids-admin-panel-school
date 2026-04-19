import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStudent extends Document {
    schoolId: string;
    studentId: string;
    fullName: string;
    dateOfBirth: string;
    gender: string;
    bloodGroup?: string;
    aadhaarNo?: string;
    class: string;
    section: string;
    rollNo?: string;
    academicYear: string;
    admissionDate: string;
    fatherName: string;
    motherName: string;
    primaryContact: string;
    email: string;
    address: string;
    city: string;
    pincode: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
    {
        schoolId: { type: String, required: true, index: true },
        studentId: { type: String, required: true, unique: true },
        fullName: { type: String, required: true },
        dateOfBirth: { type: String, required: true },
        gender: { type: String, required: true },
        bloodGroup: { type: String },
        aadhaarNo: { type: String },
        class: { type: String, required: true },
        section: { type: String, default: 'A' },
        rollNo: { type: String },
        academicYear: { type: String, default: '2025-26' },
        admissionDate: { type: String, required: true },
        fatherName: { type: String, required: true },
        motherName: { type: String, required: true },
        primaryContact: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        pincode: { type: String, required: true },
        status: { type: String, default: 'active' },
    },
    { timestamps: true }
);

const Student: Model<IStudent> = mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);

export default Student;
