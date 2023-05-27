const router = require('express').Router();
const { Op } = require('sequelize');
const { Station, Trip } = require('../models/index');
const { userAuthorisation, isAdmin } = require('../util/middleware');
const { calculateAvg, getMostPopular } = require('../util/helpers');

router.post('/', userAuthorisation, isAdmin, async (req, res) => {
  if (!req.admin) {
    return res.status(401).json({
      'authorisation error': 'no admin',
    });
  }

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

    const trips = tripsByStation.reduce(
      (all, trip) => {
        const json = trip.toJSON();
        if (json.departureStation === Number(id)) all.departure.push(json);
        if (json.returnStation === Number(id)) all.return.push(json);
        return all;
      },
      { departure: [], return: [] }
    );

    res.json({
      stationId: id,
      startTotal: trips.departure.length,
      returnTotal: trips.return.length,
      startAvg: calculateAvg(trips.departure),
      returnAvg: calculateAvg(trips.return),
      popularReturn: getMostPopular(trips.departure, 'returnStation'),
      popularDeparture: getMostPopular(trips.return, 'departureStation'),
    });
  } else {
    res.status(404).end();
  }
});

router.put('/:id', userAuthorisation, isAdmin, async (req, res) => {
  if (!req.admin) {
    return res.status(401).json({
      'authorisation error': 'no admin',
    });
  }

  const station = await Station.findByPk(req.params.id);
  if (station && req.body.capacity) {
    station.capacity = req.body.capacity;
    const updatedStation = await station.save();
    res.json(updatedStation);
  } else {
    res.status(404).end();
  }
});

router.delete('/:id', userAuthorisation, isAdmin, async (req, res) => {
  const id = req.params.id;

  if (!req.admin) {
    return res.status(401).json({
      'authorisation error': 'no admin',
    });
  }

  const station = await Station.findByPk(id);
  if (!station) {
    return res.status(404).end();
  }

  const tripsByStation = await Trip.count({
    where: {
      [Op.or]: [{ departureStation: id }, { returnStation: id }],
    },
  });

  if (tripsByStation) {
    res.status(400).json({
      'association error': 'stations with referenced trips cannot be deleted',
    });
  } else {
    await station.destroy();
    res.status(204).end();
  }
});

module.exports = router;
