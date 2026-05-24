const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const { getBusinessDashboard } = require('../controllers/businessDashboardController');

const router = Router();
router.use(authenticate);
router.get('/', getBusinessDashboard);

module.exports = router;
