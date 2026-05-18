const { Router } = require('express');
const { receiveReminder } = require('../controllers/hooksController');

const router = Router();

// Webhook endpoint — no JWT required (but in production, add an API key check)
router.post('/reminder', receiveReminder);

module.exports = router;
