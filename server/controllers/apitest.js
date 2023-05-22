const router = require('express').Router();

router.get('/ping', async (req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

module.exports = router;
