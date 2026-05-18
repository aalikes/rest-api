const TaskModel = require('../models/Task');
const AppError = require('../utils/AppError');

exports.list = (req, res) => {
  const { category, status, priority, flagged, due_before, due_after, due_this_week } = req.query;
  const filters = {};
  if (category) filters.category = category;
  if (status) filters.status = status;
  if (priority) filters.priority = priority;
  if (flagged !== undefined) filters.flagged = flagged === 'true';
  if (due_before) filters.dueBefore = due_before;
  if (due_after) filters.dueAfter = due_after;
  if (due_this_week === 'true') filters.dueThisWeek = true;

  const tasks = TaskModel.list(req.user.id, filters);
  res.json({ status: 'success', results: tasks.length, data: { tasks } });
};

exports.create = (req, res) => {
  const task = TaskModel.create({ ...req.body, user_id: req.user.id });
  res.status(201).json({ status: 'success', data: { task } });
};

exports.getById = (req, res, next) => {
  const task = TaskModel.findById(req.params.id, req.user.id);
  if (!task) return next(new AppError('Task not found.', 404));
  res.json({ status: 'success', data: { task } });
};

exports.update = (req, res, next) => {
  const task = TaskModel.update(req.params.id, req.user.id, req.body);
  if (!task) return next(new AppError('Task not found.', 404));
  res.json({ status: 'success', data: { task } });
};

exports.remove = (req, res, next) => {
  const deleted = TaskModel.delete(req.params.id, req.user.id);
  if (!deleted) return next(new AppError('Task not found.', 404));
  res.status(204).end();
};
