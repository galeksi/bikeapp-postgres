const router = require('express').Router();
const { sequelize } = require('../util/db');
const { Station, Trip } = require('../models/index');

router.get('/', async (req, res) => {
  const stations = await Station.findAll();
  res.json(stations);
});

router.get('/:id', async (req, res) => {
  const tripsByStation = await Trip.findAll({
    where: {
      departureStation: req.params.id,
    },
    attributes: [
      'departureStation',
      [sequelize.fn('COUNT', sequelize.col('id')), 'sum'],
      [sequelize.fn('SUM', sequelize.col('distance')), 'totalDistance'],
    ],
    group: [['departureStation']],
  });
  res.json(tripsByStation);
});

module.exports = router;
