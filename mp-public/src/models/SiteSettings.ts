import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISiteSettings extends Document {
    schoolIds: string[];
    schoolName: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    twitterUrl?: string;
    youtubeUrl?: string;
    admissionOpen: boolean;
    announcement?: string;
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    whatsappNumber?: string;
    mapEmbedUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
    {
        _id: { type: Schema.Types.Mixed, required: true },
        schoolIds: { type: [String], index: true },
        schoolName: { type: String, default: 'MP Public School' },
        contactEmail: { type: String },
        contactPhone: { type: String },
        address: { type: String },
        facebookUrl: { type: String },
        instagramUrl: { type: String },
        twitterUrl: { type: String },
        youtubeUrl: { type: String },
        admissionOpen: { type: Boolean, default: false },
        announcement: { type: String },
        metaTitle: { type: String },
        metaDescription: { type: String },
        ogImage: { type: String },
        whatsappNumber: { type: String },
        mapEmbedUrl: { type: String },
    },
    { timestamps: true }
);

const SiteSettings: Model<ISiteSettings> = mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);

export default SiteSettings;
