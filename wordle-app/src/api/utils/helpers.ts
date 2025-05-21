export const validateWord = (word: string): boolean => {
  const wordPattern = /^[a-zA-Z]{5}$/; // Only allows 5-letter words
  return wordPattern.test(word);
};

export interface PlayerStats {
  playerName: string;
  gamesPlayed: number;
  wins: number;
}

export interface FormattedPlayerStats extends PlayerStats {
  winRate: number;
}

export const formatPlayerStats = (stats: PlayerStats): FormattedPlayerStats => {
  return {
    playerName: stats.playerName,
    gamesPlayed: stats.gamesPlayed,
    wins: stats.wins,
    winRate: stats.gamesPlayed ? (stats.wins / stats.gamesPlayed) * 100 : 0,
  };
};

export const generateRandomWord = (wordList: string[]): string => {
  const randomIndex = Math.floor(Math.random() * wordList.length);
  return wordList[randomIndex];
};
