import { ObjectId } from "mongodb";
// import { getDb } from "../mongodb"; // Assumes mongodb.js exports getDb()

import type { PlayerStats as PlayerStatsType } from "./models/playerStats";
const PlayerStats = require("./models/playerStats"); 

const COLLECTION_NAME = "PlayerStats";

export class MongoRepository {
    private db;

    constructor() {
        this.db = getDb();
    }

    async getPlayerStats(playerId: string): Promise<PlayerStats> {
        return this.db.collection(COLLECTION_NAME).findOne({ playerId });
    }

    async createPlayerStats(stats: PlayerStats): Promise<PlayerStats> {
        const result = await this.db.collection(COLLECTION_NAME).insertOne(stats);
        return { ...stats, _id: result.insertedId };
    }

    async updatePlayerStats(playerId: string, update: Partial<PlayerStats>): Promise<void> {
        await this.db.collection(COLLECTION_NAME).updateOne(
            { playerId },
            { $set: update }
        );
    }

    async deletePlayerStats(playerId: string): Promise<void> {
        await this.db.collection(COLLECTION_NAME).deleteOne({ playerId });
    }
}