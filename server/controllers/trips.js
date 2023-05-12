const router = require('express').Router();
const { Op } = require('sequelize');
const { Trip } = require('../models/index');

router.post('/', async (req, res) => {
  const trip = await Trip.create(req.body);
  res.json(trip);
});

router.get('/', async (req, res) => {
  const where = {};
  if (req.query.departureStation) {
    where.departureStation = Number(req.query.departureStation);
  }
  if (req.query.returnStation) {
    where.returnStation = Number(req.query.returnStation);
  }
  if (req.query.date) {
    where.departure = {
      [Op.and]: {
        [Op.gte]: req.query.date,
        [Op.lte]: Date.parse(req.query.date) + 86400000,
      },
    };
  }

  const trips = await Trip.findAll({
    include: {
      all: true,
    },
    where,
    limit: 500,
    order: [['departure', 'DESC']],
  });
  res.json(trips);
});

router.get('/:id', async (req, res) => {
  const trip = await Trip.findByPk(req.params.id, {
    include: {
      all: true,
    },
  });
  if (trip) {
    res.json(trip);
  } else {
    res.status(404).end();
  }
});

router.put('/:id', async (req, res) => {
  const trip = await Trip.findByPk(req.params.id);
  if (trip) {
    if (req.body.departure) {
      trip.departure = req.body.departure;
    }
    if (req.body.return) {
      trip.return = req.body.return;
    }
    if (req.body.distance) {
      trip.distance = req.body.distance;
    }
    if (req.body.duration) {
      trip.duration = req.body.duration;
    }
    const updatedTrip = await trip.save();
    res.json(updatedTrip);
  } else {
    res.status(404).end();
  }
});

router.delete('/:id', async (req, res) => {
  const trip = await Trip.findByPk(req.params.id);
  if (trip) {
    await trip.destroy();
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

module.exports = router;
