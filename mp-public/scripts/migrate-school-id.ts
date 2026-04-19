import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
const uri = process.env.MONGODB_URI;
const SCHOOL_ID = "mp-public";

async function run() {
  if (!uri) return console.error('No URI');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  
  const collectionsToUpdate = [
    'leads',
    'admissions',
    'heroslides',
    'stats',
    'testimonials',
    'news',
    'schoolevents',
    'circulars',
    'programs',
    'facilities',
    'galleries',
    'achievements',
    'alumnis',
    'disclosures',
    'faculties',
    'feestructures',
    'jobs',
    'notificationlogs',
    'sitesettings',
    'staticpages',
    'students',
    'successstories'
  ];

  for (const colName of collectionsToUpdate) {
    const col = db.collection(colName);
    const result = await col.updateMany(
      { $or: [{ schoolId: { $exists: false } }, { schoolId: null }, { schoolId: "" }] },
      { $set: { schoolId: SCHOOL_ID } }
    );
    console.log(`Updated ${result.modifiedCount} documents in ${colName}`);
  }
  
  await client.close();
}
run();
