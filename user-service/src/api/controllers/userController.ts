import { Request, Response, NextFunction } from 'express';
import { ProfileService } from '../services/profileService';
import { GameHistoryService } from '../services/gameHistoryService';
import { RewardService } from '../services/rewardService';
import { StatsService } from '../services/statsService';

export class UserController {
    private profileService = new ProfileService();
    private gameHistoryService = new GameHistoryService();
    private rewardService = new RewardService();
    private statsService = new StatsService();

    async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const profile = await this.profileService.getProfileByUserId(req.params.userId);
            if (!profile) {
                res.status(404).json({ error: 'Profile not found' });
                return;
            }
            res.status(200).json(profile);
        } catch (e: any) {
            next(e);
        }
    }

    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const updated = await this.profileService.updateProfile(req.params.userId, req.body);
            res.status(200).json(updated);
        } catch (e: any) {
            next(e);
        }
    }

    async updateGameHistory(req: Request, res: Response, next: NextFunction) {
        try {
            await this.gameHistoryService.updateHistoryAfterGame({ ...req.body, userId: req.params.userId });
            res.status(204).send();
        } catch (e: any) {
            next(e);
        }
    }

    async getGameHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const history = await this.gameHistoryService.getHistoryByUserId(req.params.userId);
            res.status(200).json(history);
        } catch (e: any) {
            next(e);
        }
    }

    async getRewards(req: Request, res: Response, next: NextFunction) {
        try {
            const rewards = await this.rewardService.getAllRewards();
            res.status(200).json(rewards.filter(r => r.userId === req.params.userId));
        } catch (e: any) {
            next(e);
        }
    }

    async getStats(req: Request, res: Response, next: NextFunction) {
        try {
            const stats = await this.statsService.getStatsByUserId(req.params.userId);
            if (!stats) {
                res.status(404).json({ error: 'Stats not found' });
                return;
            }
            res.status(200).json(stats);
        } catch (e: any) {
            next(e);
        }
    }
}