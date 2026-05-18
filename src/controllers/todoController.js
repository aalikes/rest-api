const TodoModel = require('../models/Todo');
const AppError = require('../utils/AppError');

/**
 * GET /api/todos
 * List todos for the authenticated user, with optional ?completed filter.
 */
function list(req, res) {
  const { completed } = req.query;

  const filters = {};
  if (completed === 'true') filters.completed = true;
  if (completed === 'false') filters.completed = false;

  const todos = TodoModel.list(req.user.id, filters);
  res.status(200).json({
    status: 'success',
    results: todos.length,
    data: { todos },
  });
}

/**
 * POST /api/todos
 * Create a new todo.
 */
function create(req, res) {
  const { title } = req.body;
  const todo = TodoModel.create({ title, userId: req.user.id });
  res.status(201).json({
    status: 'success',
    data: { todo },
  });
}

/**
 * GET /api/todos/:id
 * Get a single todo.
 */
function getById(req, res, next) {
  const todo = TodoModel.findById(req.params.id, req.user.id);
  if (!todo) {
    return next(new AppError('Todo not found.', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { todo },
  });
}

/**
 * PATCH /api/todos/:id
 * Update a todo (title and/or completed).
 */
function update(req, res, next) {
  const { title, completed } = req.body;

  const fields = {};
  if (title !== undefined) fields.title = title;
  if (completed !== undefined) fields.completed = completed;

  if (Object.keys(fields).length === 0) {
    return next(new AppError('At least one field (title, completed) must be provided.', 400));
  }

  const todo = TodoModel.update(req.params.id, req.user.id, fields);
  if (!todo) {
    return next(new AppError('Todo not found.', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { todo },
  });
}

/**
 * DELETE /api/todos/:id
 * Delete a todo.
 */
function remove(req, res, next) {
  const deleted = TodoModel.delete(req.params.id, req.user.id);
  if (!deleted) {
    return next(new AppError('Todo not found.', 404));
  }
  res.status(204).end();
}

module.exports = { list, create, getById, update, remove };
