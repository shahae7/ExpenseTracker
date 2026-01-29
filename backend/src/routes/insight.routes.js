const express = require('express');
const router = express.Router();
const insightController = require('../controllers/insight.controller');

router.get('/', insightController.getInsights);

module.exports = router;
