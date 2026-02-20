import mongoose from 'mongoose';
import { Db } from 'mongodb';

const mongoURI: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/wordle';

let dbInstance: Db | null | undefined = null;

const connectMongoDB = async (): Promise<void> => {
  console.log('Wywołano connectMongoDB');
  if (dbInstance) {
    console.log('MongoDB is already connected.');
    return;
  }
  try {
    await mongoose.connect(mongoURI);
    dbInstance = mongoose.connection.db as Db;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const getDb = (): Db => {
  console.log('Wywołano getDb');
  if (!dbInstance) {
    throw new Error('Database not connected. Call connectMongoDB first.');
  }
  return dbInstance;
};

export default connectMongoDB;