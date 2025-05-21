import mongoose from 'mongoose';
import { Db } from 'mongodb';

const mongoURI: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/wordle';

let dbInstance: Db | null = null;

const connectMongoDB = async (): Promise<void> => {
  if (dbInstance) {
    console.log('MongoDB is already connected.');
    return;
  }
  try {
    await mongoose.connect(mongoURI, {
      // @ts-expect-error: Opcje są kompatybilne, ale typy mogą się różnić między wersjami mongoose
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    dbInstance = mongoose.connection.db; // Przypisz instancję Db
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Zakończ proces w przypadku błędu połączenia
  }
};

// Funkcja do pobierania instancji bazy danych
export const getDb = (): Db => {
  if (!dbInstance) {
    throw new Error('Database not connected. Call connectMongoDB first.');
  }
  return dbInstance;
};

export default connectMongoDB;