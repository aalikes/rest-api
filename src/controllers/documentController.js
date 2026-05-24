const DocumentModel = require('../models/Document');
const AppError = require('../utils/AppError');

exports.list = (req, res) => {
  const { document_type, apostille_status, client_id, order_id } = req.query;
  const filters = {};
  if (document_type) filters.document_type = document_type;
  if (apostille_status) filters.apostille_status = apostille_status;
  if (client_id) filters.client_id = parseInt(client_id, 10);
  if (order_id) filters.order_id = parseInt(order_id, 10);
  const documents = DocumentModel.list(req.user.id, filters);
  res.json({ status: 'success', results: documents.length, data: { documents } });
};

exports.create = (req, res) => {
  const document = DocumentModel.create({ ...req.body, user_id: req.user.id });
  res.status(201).json({ status: 'success', data: { document } });
};

exports.getById = (req, res, next) => {
  const document = DocumentModel.findById(req.params.id, req.user.id);
  if (!document) return next(new AppError('Document not found.', 404));
  res.json({ status: 'success', data: { document } });
};

exports.update = (req, res, next) => {
  const document = DocumentModel.update(req.params.id, req.user.id, req.body);
  if (!document) return next(new AppError('Document not found.', 404));
  res.json({ status: 'success', data: { document } });
};

exports.remove = (req, res, next) => {
  const deleted = DocumentModel.delete(req.params.id, req.user.id);
  if (!deleted) return next(new AppError('Document not found.', 404));
  res.status(204).end();
};
