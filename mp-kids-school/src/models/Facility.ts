import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFacility extends Document {
    schoolIds: string[];
    title: string;
    description: string;
    icon: string; // lucide-react icon name
    image: string; // cloudinary URL
    displayOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const FacilitySchema = new Schema<IFacility>(
    {
        schoolIds: { type: [String], index: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, required: true },
        image: { type: String, required: true },
        displayOrder: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Facility: Model<IFacility> = mongoose.models.Facility || mongoose.model<IFacility>('Facility', FacilitySchema);

export default Facility;
