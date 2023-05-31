const router = require('express').Router();
const { Station, Trip } = require('../models/index');
const { STATION_HEADER, TRIP_HEADER } = require('../util/constants');

const readCsv = require('../util/dataloader');
const multer = require('multer');
const upload = multer({ dest: 'tmp' });
const _ = require('lodash');
const { userAuthorisation, isAdmin } = require('../util/middleware');

const {
  stationValidator,
  tripValidator,
  partition,
} = require('../util/validators');

router.post(
  '/stations',
  userAuthorisation,
  isAdmin,
  upload.single('file'),
  async (req, res) => {
    if (!req.admin) {
      return res.status(401).json({
        'authorisation error': 'no admin',
      });
    }

    const data = await readCsv({
      path: req.file.path,
      options: {
        headers: STATION_HEADER,
        renameHeaders: true,
      },
      validator: stationValidator,
    });

    const validatedData = partition(data);

    const savedStations = await Station.bulkCreate(validatedData.valid, {
      ignoreDuplicates: true,
    });

    const duplicates = savedStations.filter(
      (s) => s.toJSON().id === null
    ).length;

    res.json({
      rows: data.length,
      'valid data': validatedData.valid.length,
      duplicates: duplicates,
      uploads: validatedData.valid.length - duplicates,
      'invalid rows': validatedData.invalid,
    });
  }
);

router.post(
  '/trips',
  userAuthorisation,
  isAdmin,
  upload.single('file'),
  async (req, res) => {
    if (!req.admin) {
      return res.status(401).json({
        'authorisation error': 'no admin',
      });
    }

    const stations = await Station.findAll();
    const stationsJson = stations.map((s) => s.toJSON());

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
      uploaded: uploads.length,
      invalid: validatedData.invalid.length,
      'invalid rows': validatedData.invalid,
    });
  }
);

module.exports = router;
