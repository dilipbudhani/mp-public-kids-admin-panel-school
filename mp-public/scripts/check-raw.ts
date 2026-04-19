import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
const uri = process.env.MONGODB_URI;

async function run() {
  if (!uri) return console.error('No URI');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  console.log('DB Name:', db.databaseName);
  
  const collections = await db.listCollections().toArray();
  console.log('Collections:', collections.map(c => c.name));
  
  const leads = await db.collection('leads').find({}).sort({ createdAt: -1 }).limit(5).toArray();
  console.log('\nLatest Leads (Raw):');
  console.log(JSON.stringify(leads, null, 2));

  const users = await db.collection('users').find({}).toArray();
  console.log('\nUsers (Raw):');
  console.log(JSON.stringify(users.map(u => ({ email: u.email, role: u.role })), null, 2));
  
  await client.close();
}
run();
