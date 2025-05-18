// filepath: wordle-app/wordle-app/src/utils/helpers.js
const validateWord = (word) => {
  const wordPattern = /^[a-zA-Z]{5}$/; // Only allows 5-letter words
  return wordPattern.test(word);
};

const formatPlayerStats = (stats) => {
  return {
    playerName: stats.playerName,
    gamesPlayed: stats.gamesPlayed,
    wins: stats.wins,
    winRate: stats.wins / stats.gamesPlayed * 100 || 0,
  };
};

const generateRandomWord = (wordList) => {
  const randomIndex = Math.floor(Math.random() * wordList.length);
  return wordList[randomIndex];
};

module.exports = {
  validateWord,
  formatPlayerStats,
  generateRandomWord,
};