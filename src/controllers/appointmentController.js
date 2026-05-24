const AppointmentModel = require('../models/Appointment');
const AppError = require('../utils/AppError');

exports.list = (req, res) => {
  const { status, location_type, client_id, date_from, date_to } = req.query;
  const filters = {};
  if (status) filters.status = status;
  if (location_type) filters.location_type = location_type;
  if (client_id) filters.client_id = parseInt(client_id, 10);
  if (date_from) filters.dateFrom = date_from;
  if (date_to) filters.dateTo = date_to;
  const appointments = AppointmentModel.list(req.user.id, filters);
  res.json({ status: 'success', results: appointments.length, data: { appointments } });
};

exports.create = (req, res) => {
  const appointment = AppointmentModel.create({ ...req.body, user_id: req.user.id });
  res.status(201).json({ status: 'success', data: { appointment } });
};

exports.getById = (req, res, next) => {
  const appointment = AppointmentModel.findById(req.params.id, req.user.id);
  if (!appointment) return next(new AppError('Appointment not found.', 404));
  res.json({ status: 'success', data: { appointment } });
};

exports.update = (req, res, next) => {
  const appointment = AppointmentModel.update(req.params.id, req.user.id, req.body);
  if (!appointment) return next(new AppError('Appointment not found.', 404));
  res.json({ status: 'success', data: { appointment } });
};

exports.remove = (req, res, next) => {
  const deleted = AppointmentModel.delete(req.params.id, req.user.id);
  if (!deleted) return next(new AppError('Appointment not found.', 404));
  res.status(204).end();
};
