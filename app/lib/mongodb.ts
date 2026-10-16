import { MongoClient, Db } from 'mongodb';
import type { SplitEaseDocument } from '../../types';

const COLLECTION_NAME = 'splits';

if (typeof window !== 'undefined') {
  throw new Error('This module can only be imported in server components or API routes');
}

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDb(): Promise<Db> {
  try {
    const client = await clientPromise;
    const db = client.db();
    console.log('Connected to database:', db.databaseName);
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}

const dbOperations = {
  async createNewSplit() {
    const db = await getDb();
    const shareId = Math.random().toString(36).substring(2, 10);
    
    const newDoc = {
      shareId,
      createdAt: new Date(),
      updatedAt: new Date(),
      people: [],
      items: [],
      settlements: []
    };

    console.log('Creating new split with shareId:', shareId);
    console.log('Document to insert:', newDoc);
    
    const result = await db.collection(COLLECTION_NAME).insertOne(newDoc);
    console.log('Insert result:', result);
    
    return { id: result.insertedId.toString(), shareId };
  },

  async getSplitByShareId(shareId: string): Promise<SplitEaseDocument | null> {
    const db = await getDb();
    console.log('Fetching split by shareId:', shareId);
    const split = await db.collection<SplitEaseDocument>(COLLECTION_NAME).findOne({ shareId });
    console.log('Found split:', split);
    return split;
  },

  async updateSplit(
    shareId: string, 
    data: Partial<Omit<SplitEaseDocument, '_id' | 'shareId' | 'createdAt'>>
  ): Promise<boolean> {
    const db = await getDb();
    console.log('Updating split with shareId:', shareId);
    console.log('Update data:', data);
    
    const result = await db.collection(COLLECTION_NAME).updateOne(
      { shareId },
      { 
        $set: { 
          ...data,
          updatedAt: new Date() 
        } 
      }
    );
    
    console.log('Update result:', result);
    return result.matchedCount > 0;
  }
};

export const getClient = () => client;

export default dbOperations;
