const router = require('express').Router();

const { Session } = require('../models/index');
const { userAuthorisation } = require('../util/middleware');

router.delete('/', userAuthorisation, async (req, res) => {
  const session = await Session.findByPk(req.decodedToken.token);
  if (session) {
    session.loggedOut = true;
    await session.save();
    res.status(204).end();
  } else {
    res.status(401).json({
      'authorisation error': 'no valid session',
    });
  }
});

module.exports = router;
