const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');
const { Session, User } = require('../models/index');

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).send({
      'database validation error': error.message,
    });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).send({
      'user validation error': error.message,
    });
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired',
    });
  } else if (error.name === 'Error') {
    return res.status(400).send({
      error: error.message,
    });
  }

  next(error);
};

const userAuthorisation = async (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    req.decodedToken.token = authorization.substring(7);
  } else {
    return res.status(401).json({
      'authorisation error': 'Token missing',
    });
  }

  const session = await Session.findByPk(authorization.substring(7));
  if (!session || session.loggedOut) {
    return res.status(401).json({
      'authorisation error': 'No active session, please login',
    });
  }
  next();
};

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id);

  if (user.toJSON().admin) {
    req.admin = true;
  }

  next();
};

module.exports = { errorHandler, userAuthorisation, isAdmin };
