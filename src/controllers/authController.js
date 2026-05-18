const userModel = require('../models/User');
const { sign } = require('../utils/jwt');
const AppError = require('../utils/AppError');

/**
 * POST /api/auth/register
 * Create a new user account and return a JWT.
 */
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const user = await userModel.create({ name, email, password });
    const token = sign({ sub: user.id, role: user.role });

    res.status(201).json({
      status: 'success',
      token,
      data: { user },
    });
  } catch (err) {
    if (err.statusCode === 409) {
      return next(new AppError(err.message, 409));
    }
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Authenticate with email + password and return a JWT.
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findByEmail(email);
    if (!user || !(await userModel.validatePassword(password, user.password))) {
      return next(new AppError('Invalid email or password.', 401));
    }

    const token = sign({ sub: user.id, role: user.role });
    const safeUser = await userModel.findById(user.id);

    res.status(200).json({
      status: 'success',
      token,
      data: { user: safeUser },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 * Return the currently authenticated user.
 */
async function getMe(req, res) {
  res.status(200).json({
    status: 'success',
    data: { user: req.user },
  });
}

module.exports = { register, login, getMe };
