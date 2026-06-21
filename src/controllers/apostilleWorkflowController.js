const {
  calculateApostillePrice,
  calculateFbiPrice,
  calculateComboPrice,
  createApostilleOrder,
  transitionOrder,
  transitionApostille,
  getApostillePipeline,
  PRICING,
} = require('../workflows/apostilleWorkflow');
const AppError = require('../utils/AppError');

exports.pricing = (_req, res) => {
  res.json({ status: 'success', data: PRICING });
};

exports.quote = (req, res) => {
  const { apostille_type, priority, document_count, shipping } = req.body;
  const result = calculateApostillePrice({
    apostille_type: apostille_type || 'state',
    priority: priority || 'standard',
    document_count: parseInt(document_count, 10) || 1,
    shipping: shipping || null,
  });
  res.json({ status: 'success', data: result });
};

exports.fbiQuote = (req, res) => {
  const { residency_type } = req.body;
  const result = calculateFbiPrice({ residency_type: residency_type || 'resident' });
  res.json({ status: 'success', data: result });
};

exports.comboQuote = (req, res) => {
  const { residency_type, apostille_type, priority, document_count, shipping } = req.body;
  const result = calculateComboPrice({
    residency_type: residency_type || 'resident',
    apostille_type: apostille_type || 'federal',
    priority: priority || 'standard',
    document_count: parseInt(document_count, 10) || 1,
    shipping: shipping || null,
  });
  res.json({ status: 'success', data: result });
};

exports.intake = (req, res, next) => {
  try {
    const result = createApostilleOrder({
      userId: req.user.id,
      client_id: req.body.client_id,
      service_id: req.body.service_id,
      documents: req.body.documents,
      priority: req.body.priority,
      shipping: req.body.shipping,
      notes: req.body.notes,
    });
    res.status(201).json({ status: 'success', data: result });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

exports.transitionOrder = (req, res, next) => {
  const result = transitionOrder(req.params.id, req.user.id, req.body.status);
  if (result.error) return next(new AppError(result.error, result.code));
  res.json({ status: 'success', data: { order: result.order } });
};

exports.transitionDocument = (req, res, next) => {
  const result = transitionApostille(req.params.id, req.user.id, req.body.apostille_status);
  if (result.error) return next(new AppError(result.error, result.code));
  res.json({ status: 'success', data: { document: result.document } });
};

exports.pipeline = (req, res) => {
  const result = getApostillePipeline(req.user.id);
  res.json({ status: 'success', data: result });
};
