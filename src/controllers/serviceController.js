const ServiceModel = require('../models/Service');
const AppError = require('../utils/AppError');

exports.list = (req, res) => {
  const { category, active } = req.query;
  const filters = {};
  if (category) filters.category = category;
  if (active !== undefined) filters.active = active === 'true';
  const services = ServiceModel.list(filters);
  res.json({ status: 'success', results: services.length, data: { services } });
};

exports.create = (req, res) => {
  const service = ServiceModel.create(req.body);
  res.status(201).json({ status: 'success', data: { service } });
};

exports.getById = (req, res, next) => {
  const service = ServiceModel.findById(req.params.id);
  if (!service) return next(new AppError('Service not found.', 404));
  res.json({ status: 'success', data: { service } });
};

exports.update = (req, res, next) => {
  const service = ServiceModel.update(req.params.id, req.body);
  if (!service) return next(new AppError('Service not found.', 404));
  res.json({ status: 'success', data: { service } });
};

exports.remove = (req, res, next) => {
  const deleted = ServiceModel.delete(req.params.id);
  if (!deleted) return next(new AppError('Service not found.', 404));
  res.status(204).end();
};
