const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { authenticateToken } = require('../middleware/auth');

router.get('/:courseId', authenticateToken, certificateController.generateCertificate);

module.exports = router; 