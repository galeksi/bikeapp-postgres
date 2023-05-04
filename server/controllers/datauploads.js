const router = require('express').Router();
const { Station, Trip } = require('../models/index');

const readCsv = require('../util/dataloader');
const multer = require('multer');
const upload = multer({ dest: 'tmp' });

const { stationValidator, tripValidator } = require('../util/validators');

// Custom headers to match mongoose schema for DB upload
const stationHeader = [
  'fid',
  'number',
  'nimi',
  'namn',
  'name',
  'osoite',
  'adress',
  'kaupunki',
  'stad',
  'operator',
  'capacity',
  'long',
  'lat',
];

const tripHeader = [
  'departure',
  'return',
  'departureStation',
  'departureStationName',
  'returnStation',
  'returnStationName',
  'distance',
  'duration',
];

router.post('/stations', upload.single('file'), async (req, res) => {
  // Data is uploaded to tmp/csv and validated rows with new headers returned as objects
  const data = await readCsv({
    path: req.file.path,
    options: {
      headers: stationHeader,
      renameHeaders: true,
    },
    validator: stationValidator,
  });

  // Validated data is saved to the DB
  const savedStations = await Station.bulkCreate(data, {
    ignoreDuplicates: true,
  });
  // DB returns dublicates with ID null
  const duplicates = savedStations.filter((s) => s.toJSON().id === null).length;

  res.json({
    'valid imports': data.length,
    duplicates: duplicates,
    uploads: data.length - duplicates,
  });
});

router.post('/trips', upload.single('file'), async (req, res) => {
  // Stations queried to be refrenced in trips departure and return
  const stations = await Station.findAll();
  const stationsJson = stations.map((s) => s.toJSON());

  // Data is uploaded to tmp/csv and validated rows with new headers returned as objects
  const data = await readCsv({
    path: req.file.path,
    options: {
      headers: tripHeader,
      renameHeaders: true,
    },
    validator: tripValidator,
    validatorData: stationsJson,
  });

  // Validated data is saved to the DB
  const savedTrips = await Trip.bulkCreate(data);

  res.json({
    'valid imports': data.length,
    uploads: savedTrips.length,
  });
});

module.exports = router;
