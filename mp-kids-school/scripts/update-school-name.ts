import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

// Define the schema inline to avoid import issues
const SiteSettingsSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.Mixed, required: true },
    schoolName: String,
    contactEmail: String,
    contactPhone: String,
    address: String,
    facebookUrl: String,
    instagramUrl: String,
    twitterUrl: String,
    youtubeUrl: String,
    whatsappNumber: String,
}, { timestamps: true });

const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);

async function main() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI as string);
        console.log('Connected successfully');

        console.log('Updating Site Settings...');
        const result = await SiteSettings.findOneAndUpdate(
            { _id: 'global' },
            {
                schoolName: 'MP Kids School',
                contactEmail: 'info@mpkidsschool.edu.in',
                facebookUrl: 'https://facebook.com/mpkidsschool',
                instagramUrl: 'https://instagram.com/mpkidsschool',
                twitterUrl: 'https://twitter.com/mpkidsschool',
                youtubeUrl: 'https://youtube.com/mpkidsschool',
            },
            { upsert: true, new: true }
        );

        console.log('Update result:', result);
        console.log('School name is now:', result.schoolName);

        console.log('Database update completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error updating database:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
}

main();
