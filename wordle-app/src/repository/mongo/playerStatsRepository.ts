import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";
import type { PlayerStats as PlayerStatsType } from "./models/playerStats";

const COLLECTION_NAME = "PlayerStats";

export class PlayerStatsRepository {
    private db;

    constructor() {
        this.db = getDb();
    }

    async getPlayerStats(playerId: string): Promise<PlayerStatsType> {
        return this.db.collection(COLLECTION_NAME).findOne({ playerId });
    }

    async createPlayerStats(stats: PlayerStatsType): Promise<PlayerStatsType> {
        const result = await this.db.collection(COLLECTION_NAME).insertOne(stats);
        return { ...stats, _id: result.insertedId };
    }

    async updatePlayerStats(playerId: string, update: Partial<PlayerStatsType>): Promise<void> {
        await this.db.collection(COLLECTION_NAME).updateOne(
            { playerId },
            { $set: update }
        );
    }

    async deletePlayerStats(playerId: string): Promise<void> {
        await this.db.collection(COLLECTION_NAME).deleteOne({ playerId });
    }
}