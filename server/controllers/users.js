const router = require('express').Router();
const bcrypt = require('bcrypt');

const { User, Trip, Session } = require('../models/index');
const { userAuthorisation, isAdmin } = require('../util/middleware');

router.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    username,
    name,
    passwordHash,
  };

  const newUser = await User.create(user);

  res.json(newUser);
});

router.get('/', userAuthorisation, isAdmin, async (req, res) => {
  if (!req.admin) {
    return res.status(401).json({
      'authorisation error': 'no admin',
    });
  }

  const users = await User.findAll({
    include: {
      model: Trip,
      attributes: { exclude: ['userId'] },
    },
  });

  res.json(users);
});

router.get('/:id', userAuthorisation, isAdmin, async (req, res) => {
  const id = Number(req.params.id);

  if (!(id === req.decodedToken.id || req.admin)) {
    return res.status(401).json({
      'authorisation error': 'not own user or admin',
    });
  }

  const user = await User.findByPk(id, {
    include: {
      model: Trip,
      attributes: { exclude: ['userId'] },
    },
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.put('/:id', userAuthorisation, async (req, res) => {
  const body = req.body;
  const id = Number(req.params.id);

  if (!(id === req.decodedToken.id)) {
    return res.status(401).json({
      'authorisation error': 'not own user',
    });
  }

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).end();
  }

  if (body.username) {
    user.username = body.username;
  }
  if (body.name) {
    user.name = body.name;
  }

  const updatedUser = await user.save();
  res.json(updatedUser);
});

router.put('/password/:id', userAuthorisation, async (req, res) => {
  const body = req.body;
  const id = Number(req.params.id);

  if (!(id === req.decodedToken.id)) {
    return res.status(401).json({
      'authorisation error': 'not own user',
    });
  }

  const user = await User.findByPk(id);

  const passwordCorrect = await bcrypt.compare(
    body.password,
    user.passwordHash
  );

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid user or password',
    });
  }

  const newPasswordHash = await bcrypt.hash(body.newPassword, 10);
  user.passwordHash = newPasswordHash;

  const updatedUser = await user.save();
  res.json(updatedUser);
});

router.put('/disabled/:id', userAuthorisation, isAdmin, async (req, res) => {
  if (!req.admin) {
    return res.status(401).json({
      'authorisation error': 'no admin',
    });
  }

  const user = await User.findByPk(req.params.id);

  if (user && user.disabled) {
    user.disabled = req.body.disabled;
    await user.save();
    res.json(user);
  } else if (user && user.disabled === false) {
    user.disabled = req.body.disabled;
    await Session.destroy({
      where: {
        userId: user.id,
      },
    });
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404).end();
  }
});

router.delete('/:id', userAuthorisation, isAdmin, async (req, res) => {
  const id = Number(req.params.id);

  if (!(id === req.decodedToken.id || req.admin)) {
    return res.status(401).json({
      'authorisation error': 'not own user or admin',
    });
  }

  const user = await User.findByPk(id);
  if (user) {
    await Session.destroy({
      where: {
        userId: user.id,
      },
    });
    await user.destroy();
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

module.exports = router;
