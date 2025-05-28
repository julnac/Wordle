import { getDb } from "./mongodb";
import type { PlayerStats as PlayerStatsType } from "./models/playerStats";
import type { WithId } from "mongodb";

const COLLECTION_NAME = "PlayerStats";

export class PlayerStatsRepository {

    static async getPlayerStats(playerId: string): Promise<PlayerStatsType> {
        return getDb().collection(COLLECTION_NAME).findOne({ playerId });
    }

    // static async createPlayerStats(stats: PlayerStatsType): Promise<PlayerStatsType> {
    //     const result = await this.db.collection(COLLECTION_NAME).insertOne(stats);
    //     return { ...stats, _id: result.insertedId };
    // }
    // static async createPlayerStats(stats: PlayerStatsType): Promise<WithId<PlayerStatsType>> {
    //     const result = await this.db.collection(COLLECTION_NAME).insertOne(stats);
    //     return { ...stats, _id: result.insertedId };
    // }
    static async createPlayerStats(stats: PlayerStatsType): Promise<WithId<PlayerStatsType>> {
        const result = await getDb().collection(COLLECTION_NAME).insertOne(stats);
        return { ...stats, _id: result.insertedId } as WithId<PlayerStatsType>;
    }

    static async updatePlayerStats(playerId: string, update: Partial<PlayerStatsType>): Promise<void> {
        await getDb().collection(COLLECTION_NAME).updateOne(
            { playerId },
            { $set: update }
        );
    }

    static async deletePlayerStats(playerId: string): Promise<void> {
        await getDb().collection(COLLECTION_NAME).deleteOne({ playerId });
    }
}