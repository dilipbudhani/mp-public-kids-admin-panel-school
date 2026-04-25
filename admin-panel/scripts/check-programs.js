const mongoose = require('mongoose');
require('dotenv').config({ path: 'admin-panel/.env' });

async function checkPrograms() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const ProgramSchema = new mongoose.Schema({}, { strict: false });
        const Program = mongoose.model('Program', ProgramSchema, 'programs');

        const programs = await Program.find({});
        console.log('Current Programs:');
        console.log(JSON.stringify(programs, null, 2));

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkPrograms();
