const { Router } = require('express');
const { z } = require('zod');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/financialController');

const router = Router();
router.use(authenticate);

const createSchema = z.object({
  name: z.string().trim().min(1).max(300),
  priority: z.enum(['None', 'Medium', 'High']).optional(),
  due_date: z.string().optional(),
  status: z.enum(['Active', 'Cancelled', 'Paused']).optional(),
  category: z.string().optional(),
  notes: z.string().optional(),
  auto_renew: z.boolean().optional(),
  amount: z.number().optional(),
  frequency: z.string().optional(),
});

const updateSchema = createSchema.partial();

router.get('/', ctrl.list);
router.post('/', validate(createSchema), ctrl.create);
router.get('/:id', ctrl.getById);
router.patch('/:id', validate(updateSchema), ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
