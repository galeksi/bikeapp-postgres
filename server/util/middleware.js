const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');
const { Session } = require('../models');

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'Error') {
    return response.status(400).send({
      error: error.message,
    });
  }
  if (error.name === 'SequelizeValidationError') {
    return response.status(400).send({
      'database validation error': error.message,
    });
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(400).send({
      'user validation error': error.message,
    });
  }

  next(error);
};

const userAuthorisation = async (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
  } else {
    next(Error('Token missing'));
  }

  const session = await Session.findByPk(authorization.substring(7));
  if (!session) {
    next(Error('Session expired, please login'));
  }
  next();
};

module.exports = { errorHandler, userAuthorisation };
