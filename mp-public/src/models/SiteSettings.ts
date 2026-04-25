import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISiteSettings extends Document {
    schoolIds: string[];
    schoolName: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    instagramAccessToken?: string;
    instagramUserId?: string;
    instagramEnabled?: boolean;
    facebookAccessToken?: string;
    facebookPageId?: string;
    facebookEnabled?: boolean;
    youtubeApiKey?: string;
    youtubeChannelId?: string;
    youtubeEnabled?: boolean;
    twitterUrl?: string;
    youtubeUrl?: string;
    admissionOpen: boolean;
    announcement?: string;
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    whatsappNumber?: string;
    mapEmbedUrl?: string;
    affiliationNo?: string;
    trustItem1Text?: string;
    trustItem1Sub?: string;
    trustItem2Text?: string;
    trustItem2Sub?: string;
    trustItem3Text?: string;
    trustItem3Sub?: string;
    trustItem4Text?: string;
    trustItem4Sub?: string;
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
        instagramAccessToken: { type: String },
        instagramUserId: { type: String },
        instagramEnabled: { type: Boolean, default: false },
        facebookAccessToken: { type: String },
        facebookPageId: { type: String },
        facebookEnabled: { type: Boolean, default: false },
        youtubeApiKey: { type: String },
        youtubeChannelId: { type: String },
        youtubeEnabled: { type: Boolean, default: false },
        twitterUrl: { type: String },
        youtubeUrl: { type: String },
        admissionOpen: { type: Boolean, default: false },
        announcement: { type: String },
        metaTitle: { type: String },
        metaDescription: { type: String },
        ogImage: { type: String },
        whatsappNumber: { type: String },
        mapEmbedUrl: { type: String },
        affiliationNo: { type: String },
        trustItem1Text: { type: String, default: 'CBSE Affiliated' },
        trustItem1Sub: { type: String, default: 'Affiliation No: 1234567' },
        trustItem2Text: { type: String, default: 'Expert Faculty' },
        trustItem2Sub: { type: String, default: '100+ Certified Teachers' },
        trustItem3Text: { type: String, default: 'Academic Excellence' },
        trustItem3Sub: { type: String, default: 'Established 1995' },
        trustItem4Text: { type: String, default: 'Holistic Growth' },
        trustItem4Sub: { type: String, default: 'Focus on Academic & Personal' },
    },
    { timestamps: true }
);

const SiteSettings: Model<ISiteSettings> = mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);

export default SiteSettings;
