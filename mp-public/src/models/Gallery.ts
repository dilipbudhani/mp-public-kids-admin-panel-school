import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGallery extends Document {
    schoolIds: string[];
    title: string;
    imageUrl: string;
    publicId: string;
    type: 'image' | 'video';
    thumbnailUrl?: string;
    category: 'Sports' | 'Events' | 'Academics' | 'Campus' | 'Others';
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

const GallerySchema = new Schema<IGallery>(
    {
        schoolIds: { type: [String], index: true },
        title: { type: String, required: true },
        imageUrl: { type: String, required: true },
        publicId: { type: String, required: true },
        type: { type: String, enum: ['image', 'video'], default: 'image' },
        thumbnailUrl: { type: String },
        category: {
            type: String,
            enum: ['Sports', 'Events', 'Academics', 'Campus', 'Others'],
            default: 'Others'
        },
        date: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const Gallery: Model<IGallery> = mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);

export default Gallery;
