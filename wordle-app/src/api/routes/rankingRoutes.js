const express = require('express');
const router = express.Router();
const RankingController = require('../controllers/rankingController');

const rankingController = new RankingController();

// Route to get player rankings
router.get('/rankings', rankingController.getRankings);

// Route to update player ranking
router.post('/rankings', rankingController.updateRanking);

module.exports = router;