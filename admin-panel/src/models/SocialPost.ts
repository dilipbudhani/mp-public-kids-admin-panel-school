import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISocialPost extends Document {
    platform: 'INSTAGRAM' | 'YOUTUBE' | 'FACEBOOK';
    postId: string;
    schoolId: string;
    type: string; // e.g., 'IMAGE', 'VIDEO', 'CAROUSEL_ALBUM', 'POST'
    mediaUrl: string;
    permalink: string;
    caption?: string;
    timestamp: Date;
    thumbnailUrl?: string;
    likes?: number;
    comments?: number;
    createdAt: Date;
    updatedAt: Date;
}

const SocialPostSchema = new Schema<ISocialPost>(
    {
        platform: { type: String, enum: ['INSTAGRAM', 'YOUTUBE', 'FACEBOOK'], required: true },
        postId: { type: String, required: true },
        schoolId: { type: String, required: true, index: true },
        type: { type: String, required: true },
        mediaUrl: { type: String, required: true },
        permalink: { type: String, required: true },
        caption: { type: String },
        timestamp: { type: Date, required: true },
        thumbnailUrl: { type: String },
        likes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Compound index to ensure uniqueness per platform post per school
SocialPostSchema.index({ platform: 1, postId: 1, schoolId: 1 }, { unique: true });

const SocialPost: Model<ISocialPost> = mongoose.models.SocialPost || mongoose.model<ISocialPost>('SocialPost', SocialPostSchema);

export default SocialPost;
