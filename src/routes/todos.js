const { Router } = require('express');
const { z } = require('zod');

const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const todoController = require('../controllers/todoController');

const router = Router();

// All todo routes require authentication
router.use(authenticate);

// ── Validation schemas ─────────────────────────────────────────────

const createSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title too long'),
});

const updateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  completed: z.boolean().optional(),
});

// ── Routes ─────────────────────────────────────────────────────────

router.get('/', todoController.list);
router.post('/', validate(createSchema), todoController.create);
router.get('/:id', todoController.getById);
router.patch('/:id', validate(updateSchema), todoController.update);
router.delete('/:id', todoController.remove);

module.exports = router;
