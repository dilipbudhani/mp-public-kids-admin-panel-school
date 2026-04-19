import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProgram extends Document {
    schoolIds: string[];
    title: string;
    description: string;
    icon: string; // lucide-react icon name
    href: string;
    color: string; // tailwind bg class e.g. 'bg-gold/10'
    displayOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ProgramSchema = new Schema<IProgram>(
    {
        schoolIds: { type: [String], index: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, required: true },
        href: { type: String, required: true },
        color: { type: String, default: 'bg-primary/10' },
        displayOrder: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Program: Model<IProgram> = mongoose.models.Program || mongoose.model<IProgram>('Program', ProgramSchema);

export default Program;
