const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');
const { Session, User } = require('../models/index');

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'Error') {
    return res.status(400).send({
      error: error.message,
    });
  }
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).send({
      'database validation error': error.message,
    });
  }
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).send({
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
    return res.status(401).json({
      'authorisation error': 'Token missing',
    });
  }

  const session = await Session.findByPk(authorization.substring(7));
  if (!session) {
    return res.status(401).json({
      'authorisation error': 'Session expired, please login',
    });
  }
  next();
};

const isAdmin = async (req, res, next) => {
  console.log(req.decodedToken);
  const user = await User.findByPk(req.decodedToken.id);
  console.log(user.toJSON());
  if (user.toJSON().admin) {
    req.admin = true;
  }
  next();
};

module.exports = { errorHandler, userAuthorisation, isAdmin };
