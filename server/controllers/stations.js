const router = require('express').Router();
const { Op } = require('sequelize');
const { Station, Trip } = require('../models/index');
const { calculateAvg, getMostPopular } = require('../util/helpers');

router.get('/', async (req, res) => {
  const stations = await Station.findAll();
  res.json(stations);
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const tripsByStation = await Trip.findAll({
    attributes: ['distance', 'duration', 'departureStation', 'returnStation'],
    where: {
      [Op.or]: [{ departureStation: id }, { returnStation: id }],
    },
  });

  const tripsByDeparture = [];
  const tripsByReturn = [];

  tripsByStation.map((s) => {
    if (s.toJSON().departureStation === Number(id))
      tripsByDeparture.push(s.toJSON());
    if (s.toJSON().returnStation === Number(id)) tripsByReturn.push(s.toJSON());
  });

  res.json({
    stationId: id,
    startTotal: tripsByDeparture.length,
    returnTotal: tripsByReturn.length,
    startAvg: calculateAvg(tripsByDeparture),
    returnAvg: calculateAvg(tripsByReturn),
    popularReturn: getMostPopular(tripsByDeparture, 'returnStation'),
    popularDeparture: getMostPopular(tripsByReturn, 'departureStation'),
  });
});

module.exports = router;
