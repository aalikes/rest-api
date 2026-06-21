const ClientModel = require('../models/Client');
const AppError = require('../utils/AppError');

exports.list = (req, res) => {
  const { id_verified, search } = req.query;
  const filters = {};
  if (id_verified !== undefined) filters.id_verified = id_verified === 'true';
  if (search) filters.search = search;
  const clients = ClientModel.list(req.user.id, filters);
  res.json({ status: 'success', results: clients.length, data: { clients } });
};

exports.create = (req, res) => {
  const client = ClientModel.create({ ...req.body, user_id: req.user.id });
  res.status(201).json({ status: 'success', data: { client } });
};

exports.getById = (req, res, next) => {
  const client = ClientModel.findById(req.params.id, req.user.id);
  if (!client) return next(new AppError('Client not found.', 404));
  res.json({ status: 'success', data: { client } });
};

exports.update = (req, res, next) => {
  const client = ClientModel.update(req.params.id, req.user.id, req.body);
  if (!client) return next(new AppError('Client not found.', 404));
  res.json({ status: 'success', data: { client } });
};

exports.remove = (req, res, next) => {
  const deleted = ClientModel.delete(req.params.id, req.user.id);
  if (!deleted) return next(new AppError('Client not found.', 404));
  res.status(204).end();
};
