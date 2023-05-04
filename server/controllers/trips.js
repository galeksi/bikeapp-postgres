const router = require('express').Router();
const { Trip } = require('../models/index');

router.get('/', async (req, res) => {
  const trips = await Trip.findAll({
    include: {
      all: true,
    },
  });
  res.json(trips);
});

router.post('/', async (req, res) => {
  console.log(req.body);
  const trip = await Trip.create(req.body);
  res.json(trip);
});

module.exports = router;
