const { Router } = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/adminController');

const router = Router();
router.use(authenticate);
router.use(authorize('admin'));

router.get('/users', ctrl.listUsers);
router.put('/users/:id/role', ctrl.setRole);
router.get('/stats', ctrl.systemStats);

module.exports = router;
