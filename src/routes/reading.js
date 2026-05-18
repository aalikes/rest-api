const { Router } = require('express');
const { z } = require('zod');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/readingController');

const router = Router();
router.use(authenticate);

const createSchema = z.object({
  name: z.string().trim().min(1).max(300),
  status: z.enum(['Want to Read', 'Reading', 'Finished', 'Archived']).optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  format: z.string().optional(),
  notes: z.string().optional(),
  tags: z.string().optional(),
});

const updateSchema = createSchema.partial();

router.get('/', ctrl.list);
router.post('/', validate(createSchema), ctrl.create);
router.get('/:id', ctrl.getById);
router.patch('/:id', validate(updateSchema), ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
