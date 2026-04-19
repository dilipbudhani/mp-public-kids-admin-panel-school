import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

async function migrate() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI!);
        console.log('Connected successfully.');

        const SiteSettingsSchema = new mongoose.Schema({
            schoolName: String,
            contactEmail: String,
            metaTitle: String,
            metaDescription: String,
        }, { strict: false });

        const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);

        console.log('Updating SiteSettings documents...');

        // Update all settings documents
        const result = await SiteSettings.updateMany(
            {},
            {
                $set: {
                    schoolName: 'MP Public School',
                    contactEmail: 'info@mppublicschool.org'
                }
            }
        );

        console.log(`Successfully updated ${result.modifiedCount} documents.`);

        // Specifically update metaTitle and metaDescription if they mention the old name
        const settings = await SiteSettings.find({});
        for (const doc of settings) {
            let updated = false;
            let metaTitle = doc.metaTitle || '';
            let metaDescription = doc.metaDescription || '';

            if (metaTitle.includes('MP Public School')) {
                metaTitle = metaTitle.replace(/MP Public School/g, 'MP Public School');
                updated = true;
            }
            if (metaDescription.includes('MP Public School')) {
                metaDescription = metaDescription.replace(/MP Public School/g, 'MP Public School');
                updated = true;
            }
            if (metaDescription.includes('mppublicschool.org')) {
                metaDescription = metaDescription.replace(/mppublicschool.org/g, 'mppublicschool.org');
                updated = true;
            }

            if (updated) {
                await SiteSettings.updateOne({ _id: doc._id }, { $set: { metaTitle, metaDescription } });
                console.log(`Updated metadata for document ${doc._id}`);
            }
        }

        console.log('Rebranding migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

migrate();
