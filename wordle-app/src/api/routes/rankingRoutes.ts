import express, { Router } from 'express';
import RankingController from '../controllers/rankingController';

const router: Router = express.Router();
const rankingController = new RankingController();

// Route to get player rankings
router.get('/rankings', rankingController.getRankings);

// Route to update player ranking
router.post('/rankings', rankingController.updateRanking);

export default router;
