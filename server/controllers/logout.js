const router = require('express').Router();

const { Session } = require('../models/index');
const { userAuthorisation } = require('../util/middleware');

router.delete('/', userAuthorisation, async (req, res) => {
  const token = req.get('authorization').substring(7);
  const session = await Session.findByPk(token);
  await session.destroy();
  res.status(204).end();
});

module.exports = router;
