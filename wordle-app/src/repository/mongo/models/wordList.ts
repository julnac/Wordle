import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IWordList extends Document {
  word: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: string;
  category?: string;
}

const wordListSchema: Schema<IWordList> = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 7
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  language: {
    type: String,
    required: true,
    enum: ['pl', 'en'],
    index: true
  },
  category: {
    type: String,
    required: false,
    index: true
  }
});

wordListSchema.index({ word: 1, language: 1 }, { unique: true });
wordListSchema.index({ language: 1, difficulty: 1, category: 1 }); // szybkie filtrowanie
wordListSchema.index({ language: 1, difficulty: 1 });

const WordList: Model<IWordList> = mongoose.model<IWordList>('WordList', wordListSchema);

export default WordList;
