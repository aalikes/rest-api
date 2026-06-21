const { Router } = require('express');
const { z } = require('zod');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/serviceController');

const router = Router();

const createSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(300),
  category: z.enum(['fingerprint', 'apostille', 'fbi']),
  description: z.string().max(2000).optional(),
  base_price: z.number().min(0).optional(),
  processing_days: z.number().int().min(0).optional(),
  service_type: z.string().max(100).optional(),
  active: z.boolean().optional(),
});

const updateSchema = createSchema.partial();

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', authenticate, authorize('admin'), validate(createSchema), ctrl.create);
router.patch('/:id', authenticate, authorize('admin'), validate(updateSchema), ctrl.update);
router.delete('/:id', authenticate, authorize('admin'), ctrl.remove);

module.exports = router;
