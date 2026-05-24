const OrderModel = require('../models/Order');
const AppError = require('../utils/AppError');

exports.list = (req, res) => {
  const { status, priority, client_id, service_id } = req.query;
  const filters = {};
  if (status) filters.status = status;
  if (priority) filters.priority = priority;
  if (client_id) filters.client_id = parseInt(client_id, 10);
  if (service_id) filters.service_id = parseInt(service_id, 10);
  const orders = OrderModel.list(req.user.id, filters);
  res.json({ status: 'success', results: orders.length, data: { orders } });
};

exports.create = (req, res) => {
  const order = OrderModel.create({ ...req.body, user_id: req.user.id });
  res.status(201).json({ status: 'success', data: { order } });
};

exports.getById = (req, res, next) => {
  const order = OrderModel.findById(req.params.id, req.user.id);
  if (!order) return next(new AppError('Order not found.', 404));
  res.json({ status: 'success', data: { order } });
};

exports.update = (req, res, next) => {
  const order = OrderModel.update(req.params.id, req.user.id, req.body);
  if (!order) return next(new AppError('Order not found.', 404));
  res.json({ status: 'success', data: { order } });
};

exports.remove = (req, res, next) => {
  const deleted = OrderModel.delete(req.params.id, req.user.id);
  if (!deleted) return next(new AppError('Order not found.', 404));
  res.status(204).end();
};
