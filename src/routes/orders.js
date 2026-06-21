const { Router } = require('express');
const { z } = require('zod');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/orderController');

const router = Router();
router.use(authenticate);

const createSchema = z.object({
  client_id: z.number().int().positive(),
  service_id: z.number().int().positive(),
  status: z.enum(['received', 'processing', 'submitted_to_agency', 'completed', 'shipped', 'rejected']).optional(),
  priority: z.enum(['standard', 'priority', 'expedited']).optional(),
  document_type: z.string().max(200).optional(),
  total_amount: z.number().min(0).optional(),
  shipping_method: z.string().max(100).optional(),
  tracking_number: z.string().max(200).optional(),
  notes: z.string().max(2000).optional(),
  estimated_completion: z.string().optional(),
});

const updateSchema = createSchema.partial();

router.get('/', ctrl.list);
router.post('/', validate(createSchema), ctrl.create);
router.get('/:id', ctrl.getById);
router.patch('/:id', validate(updateSchema), ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
