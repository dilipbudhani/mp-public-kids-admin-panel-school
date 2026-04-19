import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });
const MONGODB_URI = process.env.MONGODB_URI;

// Import models using relative paths
import Lead from '../src/models/Lead';
import User from '../src/models/User';

async function check() {
    if (!MONGODB_URI) {
        console.error('MONGODB_URI not found');
        return;
    }
    await mongoose.connect(MONGODB_URI);
    console.log('CONNECTED TO DB');
    
    console.log('\n--- LATEST LEADS ---');
    const leads = await Lead.find({}).sort({ createdAt: -1 }).limit(10);
    leads.forEach(l => {
        console.log(`[${l.createdAt.toISOString()}] Name: ${l.name} | Phone: ${l.phone} | Source: ${l.source} | Message: ${l.message}`);
    });
    
    console.log('\n--- ADMIN USERS ---');
    const users = await User.find({ role: 'admin' });
    users.forEach(u => {
        console.log(`Email: ${u.email} | Name: ${u.name}`);
    });
    
    await mongoose.disconnect();
}

check().catch(console.error);
