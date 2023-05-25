const router = require('express').Router();

const { Session } = require('../models/index');
const { userAuthorisation } = require('../util/middleware');

router.delete('/', userAuthorisation, async (req, res) => {
  await Session.destroy({
    where: {
      token: req.decodedToken.token,
    },
  });
  res.status(204).end();
});

module.exports = router;
