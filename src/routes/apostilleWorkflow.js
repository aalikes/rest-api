const { Router } = require('express');
const { z } = require('zod');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/apostilleWorkflowController');

const router = Router();

const quoteSchema = z.object({
  apostille_type: z.enum(['state', 'federal']).optional(),
  priority: z.enum(['standard', 'priority']).optional(),
  document_count: z.number().int().min(1).optional(),
  shipping: z.enum(['standard', 'expedited', 'international']).optional().nullable(),
});

const documentSchema = z.object({
  document_type: z.enum([
    'birth_certificate', 'marriage_certificate', 'fbi_report',
    'diploma', 'corporate', 'court_document', 'power_of_attorney', 'other',
  ]),
  original_filename: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
});

const intakeSchema = z.object({
  client_id: z.number().int().positive(),
  service_id: z.number().int().positive(),
  documents: z.array(documentSchema).min(1),
  priority: z.enum(['standard', 'priority']).optional(),
  shipping: z.enum(['standard', 'expedited', 'international']).optional().nullable(),
  notes: z.string().max(2000).optional(),
});

const transitionOrderSchema = z.object({
  status: z.enum(['received', 'processing', 'submitted_to_agency', 'completed', 'shipped', 'rejected']),
});

const transitionDocSchema = z.object({
  apostille_status: z.enum(['pending', 'submitted', 'apostilled', 'rejected', 'not_applicable']),
});

// Public
router.get('/pricing', ctrl.pricing);
router.post('/quote', validate(quoteSchema), ctrl.quote);

// Authenticated
router.post('/intake', authenticate, validate(intakeSchema), ctrl.intake);
router.get('/pipeline', authenticate, ctrl.pipeline);
router.patch('/orders/:id/transition', authenticate, validate(transitionOrderSchema), ctrl.transitionOrder);
router.patch('/documents/:id/transition', authenticate, validate(transitionDocSchema), ctrl.transitionDocument);

module.exports = router;
