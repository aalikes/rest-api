const { Router } = require('express');
const { z } = require('zod');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/documentController');

const router = Router();
router.use(authenticate);

const createSchema = z.object({
  client_id: z.number().int().positive(),
  order_id: z.number().int().positive().optional(),
  document_type: z.enum(['birth_certificate', 'marriage_certificate', 'fbi_report', 'diploma', 'corporate', 'court_document', 'power_of_attorney', 'other']),
  original_filename: z.string().max(500).optional(),
  apostille_status: z.enum(['pending', 'submitted', 'apostilled', 'rejected', 'not_applicable']).optional(),
  notes: z.string().max(2000).optional(),
});

const updateSchema = createSchema.partial();

router.get('/', ctrl.list);
router.post('/', validate(createSchema), ctrl.create);
router.get('/:id', ctrl.getById);
router.patch('/:id', validate(updateSchema), ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
