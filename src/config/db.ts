import { MongoClient, Db } from "mongodb";

export let client: MongoClient | null = null;
export let db: Db | null = null;

const dbName = "nextAuthLearning";

export async function connectDB(): Promise<Db | null> {
  try {
    if (client && db) {
      console.log("Database already connected");
      return db;
    }

    const uri: string = process.env.NEXT_MONGO_URI || "";
    if (!uri) {
      throw new Error("MongoDB connection URI not provided");
    }

    client = new MongoClient(uri);
    await client.connect();

    db = client.db(dbName);

    console.log(
      `Successfully connected to MongoDB and using database: ${dbName}`
    );

    return db;
  } catch (error) {
    console.error("Something went wrong connecting to the database");
    console.error(error);
    process.exit(1);
  }

  return null;
}
