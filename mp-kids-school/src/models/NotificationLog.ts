import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotificationLog extends Document {
    schoolId: string;
    recipient: string; // Phone or Email
    type: 'whatsapp' | 'email';
    template: string; // e.g., 'admission_applied', 'lead_contacted'
    status: 'sent' | 'failed';
    errorMessage?: string;
    metadata?: any; // To store related IDs (e.g., studentId, leadId)
    sentAt: Date;
}

const NotificationLogSchema = new Schema<INotificationLog>(
    {
        recipient: { type: String, required: true },
        type: { type: String, enum: ['whatsapp', 'email'], required: true },
        template: { type: String, required: true },
        status: { type: String, enum: ['sent', 'failed'], default: 'sent' },
        errorMessage: { type: String },
        metadata: { type: Schema.Types.Mixed },
        sentAt: { type: Date, default: Date.now },
    },
    { timestamps: false }
);

const NotificationLog: Model<INotificationLog> = mongoose.models.NotificationLog || mongoose.model<INotificationLog>('NotificationLog', NotificationLogSchema);

export default NotificationLog;
