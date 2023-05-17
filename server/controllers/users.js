const router = require('express').Router();
const bcrypt = require('bcrypt');

const { User, Trip } = require('../models/index');

router.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = {
    username,
    name,
    passwordHash,
  };

  const newUser = await User.create(user);

  res.json(newUser);
});

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Trip,
      attributes: { exclude: ['userId'] },
    },
  });
  res.json(users);
});

module.exports = router;
