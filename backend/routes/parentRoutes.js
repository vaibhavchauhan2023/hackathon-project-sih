const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');

// Parent dashboard routes
router.get('/dashboard/:parentEmail', parentController.getParentDashboard);
router.get('/child/:childId/progress', parentController.getChildProgress);
router.get('/child/:childId/activity', parentController.getChildActivity);
router.get('/child/:childId/recommendations', parentController.getLearningRecommendations);
router.put('/child/:childId/settings', parentController.updateParentSettings);

module.exports = router;
