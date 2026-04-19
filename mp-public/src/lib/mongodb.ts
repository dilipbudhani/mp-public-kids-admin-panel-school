import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

// Mongoose cache
let cached = (global as any).mongoose;
if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

// Clean up any old faulty plugins from Mongoose global state (purging "zombie" plugins in dev environment)
if ((mongoose as any).plugins && Array.isArray((mongoose as any).plugins)) {
    const pArray = (mongoose as any).plugins;
    for (let i = pArray.length - 1; i >= 0; i--) {
        const p = pArray[i];
        if (p && Array.isArray(p) && typeof p[0] === 'function') {
            const code = p[0].toString();
            if (code.includes('schema.paths') || code.includes('schema.pre')) {
                pArray.splice(i, 1);
            }
        }
    }
}

// Global Multi-tenancy Plugin
const SCHOOL_ID = process.env.SCHOOL_ID;
if (SCHOOL_ID) {
    mongoose.plugin((s: any) => {
        // Only apply to schemas that have schoolId or schoolIds field
        if (s.paths.schoolId || s.paths.schoolIds) {
            const filterBySchool = function (this: any, next: any) {
                const query = this.getQuery();

                // If query has _id, skip school filtering
                if (query._id) return next();

                // Use schoolIds if available
                if (s.paths.schoolIds) {
                    if (!query.schoolIds) {
                        this.where({
                            $or: [
                                { schoolIds: { $in: [SCHOOL_ID] } },
                                { schoolIds: { $exists: false } },
                                { schoolIds: { $size: 0 } },
                                { schoolIds: null }
                            ]
                        });
                    }
                } else if (s.paths.schoolId) {
                    if (!query.schoolId) {
                        this.where({
                            $or: [
                                { schoolId: SCHOOL_ID },
                                { schoolId: { $exists: false } },
                                { schoolId: null },
                                { schoolId: "" }
                            ]
                        });
                    }
                }
                next();
            };

            s.pre(['find', 'findOne', 'count', 'countDocuments', 'estimatedDocumentCount', 'findOneAndUpdate', 'updateMany', 'deleteOne', 'deleteMany'], filterBySchool);
        }
    });
}

export async function dbConnect() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI!, { bufferCommands: false }).then((m) => m);
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
    return cached.conn;
}

// Raw MongoDB client for NextAuth adapter
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
    if (!(global as any)._mongoClientPromise) {
        client = new MongoClient(MONGODB_URI);
        (global as any)._mongoClientPromise = client.connect();
    }
    clientPromise = (global as any)._mongoClientPromise;
} else {
    client = new MongoClient(MONGODB_URI);
    clientPromise = client.connect();
}

export { clientPromise };
