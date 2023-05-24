const router = require('express').Router();
const { Station, Trip } = require('../models/index');
const { STATION_HEADER, TRIP_HEADER } = require('../util/constants');

const readCsv = require('../util/dataloader');
const multer = require('multer');
const upload = multer({ dest: 'tmp' });
const _ = require('lodash');

const {
  stationValidator,
  tripValidator,
  partition,
} = require('../util/validators');

// Custom headers to match mongoose schema for DB upload
// const STATION_HEADER = [
//   'fid',
//   'number',
//   'nimi',
//   'namn',
//   'name',
//   'osoite',
//   'adress',
//   'kaupunki',
//   'stad',
//   'operator',
//   'capacity',
//   'long',
//   'lat',
// ];

// const TRIP_HEADER = [
//   'departure',
//   'return',
//   'departureStation',
//   'departureStationName',
//   'returnStation',
//   'returnStationName',
//   'distance',
//   'duration',
// ];

router.post('/stations', upload.single('file'), async (req, res) => {
  // Data is uploaded to tmp/csv and validated rows with new headers returned as objects
  const data = await readCsv({
    path: req.file.path,
    options: {
      headers: STATION_HEADER,
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
      headers: TRIP_HEADER,
      renameHeaders: true,
    },
    validator: tripValidator,
    validatorData: stationsJson,
  });

  const validatedData = partition(data);
  const chunkedData = _.chunk(validatedData.valid, 1000);

  const uploadChunks = async (data) => {
    const result = [];

    for (let chunk of data) {
      const trips = await Trip.bulkCreate(chunk);
      trips.forEach((e) => result.push(e.toJSON()));
    }

    return result;
  };

  const uploads = await uploadChunks(chunkedData);

  res.json({
    'valid imports': validatedData.valid.length,
    'uploaded imports': uploads.length,
    invalid: validatedData.invalid.length,
    'invalid rows': validatedData.invalid,
  });
});

module.exports = router;
