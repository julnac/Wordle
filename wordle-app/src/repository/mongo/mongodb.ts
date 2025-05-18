import mongoose from 'mongoose';

const mongoURI: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/wordle';

const connectMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoURI, {
      // @ts-expect-error: Options are compatible, but types may differ between mongoose versions
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectMongoDB;
