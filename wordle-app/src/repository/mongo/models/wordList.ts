import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IWordList extends Document {
  word: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const wordListSchema: Schema<IWordList> = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 7
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  }
});

const WordList: Model<IWordList> = mongoose.model<IWordList>('WordList', wordListSchema);

export default WordList;
