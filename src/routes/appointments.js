const { Router } = require('express');
const { z } = require('zod');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/appointmentController');

const router = Router();
router.use(authenticate);

const createSchema = z.object({
  client_id: z.number().int().positive(),
  service_id: z.number().int().positive(),
  appointment_date: z.string().min(1, 'Appointment date is required'),
  appointment_time: z.string().optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'no_show']).optional(),
  technician_notes: z.string().max(2000).optional(),
});

const updateSchema = createSchema.partial();

router.get('/', ctrl.list);
router.post('/', validate(createSchema), ctrl.create);
router.get('/:id', ctrl.getById);
router.patch('/:id', validate(updateSchema), ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
