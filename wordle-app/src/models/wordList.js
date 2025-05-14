const mongoose = require('mongoose');

const wordListSchema = new mongoose.Schema({
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

const WordList = mongoose.model('WordList', wordListSchema);

module.exports = WordList;