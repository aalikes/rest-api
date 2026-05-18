const { Router } = require('express');
const { receiveReminder, addForm } = require('../controllers/hooksController');

const router = Router();

router.post('/reminder', receiveReminder);
router.get('/add', addForm); // mobile-friendly HTML form

module.exports = router;
