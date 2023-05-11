const router = require('express').Router();
const { Op } = require('sequelize');
const { Station, Trip } = require('../models/index');
const { calculateAvg, getMostPopular } = require('../util/helpers');

router.post('/', async (req, res) => {
  const number = await Station.max('number');
  const station = req.body;
  station.number = number + 1;
  const newStation = await Station.create(station);
  res.json(newStation);
});

router.get('/', async (req, res) => {
  const stations = await Station.findAll();
  res.json(stations);
});

router.get('/:id', async (req, res) => {
  const station = await Station.findByPk(req.params.id);
  if (station) {
    res.json(station);
  } else {
    res.status(404).end();
  }
});

router.get('/:id/stats', async (req, res) => {
  const id = req.params.id;
  const station = Station.findByPk(id);
  if (station) {
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
      if (s.toJSON().returnStation === Number(id))
        tripsByReturn.push(s.toJSON());
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
  } else {
    res.status(404).end();
  }
});

router.put('/:id', async (req, res) => {
  const station = await Station.findByPk(req.params.id);
  if (station && req.body.capacity) {
    station.capacity = req.body.capacity;
    const updatedStation = await station.save();
    res.json(updatedStation);
  } else {
    res.status(404).end();
  }
});

router.delete('/:id', async (req, res) => {
  const station = await Station.findByPk(req.params.id);
  if (station) {
    await station.destroy();
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

module.exports = router;
