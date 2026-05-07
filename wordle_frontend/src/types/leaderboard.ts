export interface LeaderboardItem {
    member: string;
    score: string;
}

export interface LeaderboardQueryParams {
    language?: string; 
    difficulty?: string; 
    count?: number 
}
