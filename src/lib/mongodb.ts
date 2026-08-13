import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function isMongoConfigured(): boolean {
  return !!process.env.MONGODB_URI;
}

export async function getMongoClient(): Promise<MongoClient | null> {
  if (!uri) {
    console.warn("MONGODB_URI environment variable is not set. Running in local memory/fallback mode.");
    return null;
  }

  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so the MongoClient is not created repeatedly
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    // In production mode (Vercel Serverless), create a cached connection
    if (!clientPromise) {
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

export async function getDatabase(dbName: string = "resumetailor_ai"): Promise<Db | null> {
  const mongoClient = await getMongoClient();
  if (!mongoClient) return null;
  return mongoClient.db(dbName);
}
