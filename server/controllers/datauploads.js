const router = require('express').Router();
const { Station } = require('../models/index');

const csv = require('fast-csv');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'tmp' });
const isValidCoordinates = require('is-valid-coordinates');
// const moment = require('moment');

const stationValidator = (obj) => {
  // Empty fields are corrected for this dataset to have consistent database entries
  if (obj.kaupunki === ' ') obj.kaupunki = 'Helsinki';
  if (obj.stad === ' ') obj.stad = 'Helsingfors';
  if (obj.operator === ' ') obj.operator = 'CityBike Finland';

  // Station number and coordinates are validated
  if (isNaN(Number(obj.number)) || Number(obj.number) <= 0) return null;
  if (!isValidCoordinates(Number(obj.long), Number(obj.lat))) return null;

  return obj;
};

// fast-csv package is changed to a promise returning function to be called seperately and asynchrone
const readCsv = (path, options, validator, validatorData) => {
  return new Promise((resolve, reject) => {
    const fileRows = [];

    csv
      .parseFile(path, options)
      .on('error', (error) => {
        console.error(error);
        return reject(error);
      })
      .on('data', (row) => {
        const validData = validator ? validator(row, validatorData) : row;
        if (validData) fileRows.push(validData);
      })
      .on('end', () => {
        // if (process.env.NODE_ENV === !'test') fs.unlinkSync(path);
        fs.unlinkSync(path);
        resolve(fileRows);
      });
  });
};

router.post('/stations', upload.single('file'), async (req, res) => {
  // Custom header to match mongoose schema for DB upload
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

  // Data is uploaded to tmp/csv and validated rows with new headers returned as objects
  const data = await readCsv(
    req.file.path,
    {
      headers: stationHeader,
      renameHeaders: true,
    },
    stationValidator
  );
  console.log(data);

  // Validated data is saved to the DB
  const savedStations = await Station.bulkCreate(data, {
    ignoreDuplicates: true,
  });

  // console.log(savedStations.toJson());
  savedStations.map((s) => console.log(s.toJSON()));

  if (savedStations) {
    res.json({
      'valid imports': data.length,
      uploads: savedStations.length,
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
