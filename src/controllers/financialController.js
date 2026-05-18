const FinancialModel = require('../models/Financial');
const AppError = require('../utils/AppError');

exports.list = (req, res) => {
  const { category, status, due_before, due_after, due_this_week } = req.query;
  const filters = {};
  if (category) filters.category = category;
  if (status) filters.status = status;
  if (due_before) filters.dueBefore = due_before;
  if (due_after) filters.dueAfter = due_after;
  if (due_this_week === 'true') filters.dueThisWeek = true;

  const items = FinancialModel.list(req.user.id, filters);
  res.json({ status: 'success', results: items.length, data: { financials: items } });
};

exports.create = (req, res) => {
  const item = FinancialModel.create({ ...req.body, user_id: req.user.id });
  res.status(201).json({ status: 'success', data: { financial: item } });
};

exports.getById = (req, res, next) => {
  const item = FinancialModel.findById(req.params.id, req.user.id);
  if (!item) return next(new AppError('Financial item not found.', 404));
  res.json({ status: 'success', data: { financial: item } });
};

exports.update = (req, res, next) => {
  const item = FinancialModel.update(req.params.id, req.user.id, req.body);
  if (!item) return next(new AppError('Financial item not found.', 404));
  res.json({ status: 'success', data: { financial: item } });
};

exports.remove = (req, res, next) => {
  const deleted = FinancialModel.delete(req.params.id, req.user.id);
  if (!deleted) return next(new AppError('Financial item not found.', 404));
  res.status(204).end();
};
