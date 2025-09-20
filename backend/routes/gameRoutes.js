const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// Mission and Progress routes
router.post('/progress/mission', gameController.saveMissionProgress);
router.get('/progress/user/:userId', gameController.getUserProgress);

// Game Score routes
router.post('/scores/save', gameController.saveGameScore);
router.get('/scores/user/:userId', gameController.getUserGameScores);

// Worlds and Missions routes
router.get('/worlds', gameController.getWorlds);
router.get('/worlds/:worldId/missions', gameController.getWorldMissions);
router.get('/missions/:missionId/games', gameController.getMissionGames);

// Badges routes
router.post('/badges/award', gameController.awardBadge);
router.get('/badges/user/:userId', gameController.getUserBadges);

// Daily Challenge routes
router.get('/daily-challenge', gameController.getDailyChallenge);
router.post('/daily-challenge/complete', gameController.completeDailyChallenge);

module.exports = router;
