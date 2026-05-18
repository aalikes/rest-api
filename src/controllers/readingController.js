const ReadingModel = require('../models/Reading');
const AppError = require('../utils/AppError');

exports.list = (req, res) => {
  const { status, format } = req.query;
  const filters = {};
  if (status) filters.status = status;
  if (format) filters.format = format;
  const items = ReadingModel.list(req.user.id, filters);
  res.json({ status: 'success', results: items.length, data: { reading: items } });
};

exports.create = (req, res) => {
  const item = ReadingModel.create({ ...req.body, user_id: req.user.id });
  res.status(201).json({ status: 'success', data: { reading: item } });
};

exports.getById = (req, res, next) => {
  const item = ReadingModel.findById(req.params.id, req.user.id);
  if (!item) return next(new AppError('Reading item not found.', 404));
  res.json({ status: 'success', data: { reading: item } });
};

exports.update = (req, res, next) => {
  const item = ReadingModel.update(req.params.id, req.user.id, req.body);
  if (!item) return next(new AppError('Reading item not found.', 404));
  res.json({ status: 'success', data: { reading: item } });
};

exports.remove = (req, res, next) => {
  const deleted = ReadingModel.delete(req.params.id, req.user.id);
  if (!deleted) return next(new AppError('Reading item not found.', 404));
  res.status(204).end();
};
