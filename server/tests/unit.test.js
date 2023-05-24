const fs = require('fs').promises;
const path = require('node:path');

const { STATION_HEADER, TRIP_HEADER } = require('../util/constants');

const readCsv = require('../util/dataloader');
const {
  stationValidator,
  tripValidator,
  partition,
} = require('../util/validators');
const { calculateAvg, getMostPopular } = require('../util/helpers');

const src = path.resolve(__dirname, './csv');
const dest = path.resolve(__dirname, './tmp');

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

let stations;
let validatedStations;
let trips;
let allValidStations;
let validatedTrips;

beforeAll(async () => {
  await fs.copyFile(
    `${src}/allValidStations.csv`,
    `${dest}/allValidStations.csv`
  );
  await fs.copyFile(`${src}/stations.csv`, `${dest}/stations.csv`);
  await fs.copyFile(`${src}/trips.csv`, `${dest}/trips.csv`);

  stations = await readCsv({
    path: `${dest}/stations.csv`,
    options: {
      headers: STATION_HEADER,
      renameHeaders: true,
    },
  });
  validatedStations = stations.map((station) => stationValidator(station));

  const allStations = await readCsv({
    path: `${dest}/allValidStations.csv`,
    options: {
      headers: STATION_HEADER,
      renameHeaders: true,
    },
  });
  allValidStations = allStations.map((s) => {
    s.number = Number(s.number);
    s.id = s.number;
    return s;
  });

  trips = await readCsv({
    path: `${dest}/trips.csv`,
    options: {
      headers: TRIP_HEADER,
      renameHeaders: true,
    },
  });
  validatedTrips = trips.map((trip) => tripValidator(trip, allValidStations));
});

describe('Reading and parsing csv files', () => {
  test('Parse stations', async () => {
    expect(stations.length).toBe(11);
    expect(Object.keys(stations[0])).toEqual(STATION_HEADER);
  });

  test('Parse trips', async () => {
    expect(trips.length).toBe(116);
    expect(Object.keys(trips[0])).toEqual(TRIP_HEADER);
  });
});

describe('Station validations', () => {
  test('Number has to be greater than zero', async () => {
    expect(validatedStations[0]).toBe(null);
  });

  test('Number has to be a number', async () => {
    expect(validatedStations[1]).toBe(null);
  });

  test('Empty fields are corrected', async () => {
    expect(validatedStations[2].kaupunki).toBe('Helsinki');
    expect(validatedStations[2].stad).toBe('Helsingfors');
    expect(validatedStations[2].operator).toBe('CityBike Finland');
  });

  test('Coordinates are valid', async () => {
    expect(validatedStations[3]).toBe(null);
    expect(validatedStations[4]).toBe(null);
  });

  test('Correct entry passes as valid', async () => {
    expect(validatedStations[5]).not.toBe(null);
  });
});

describe('Trip validations', () => {
  test('Valid stations number for departure or return', async () => {
    expect(validatedTrips[0]).toBe(null);
    expect(validatedTrips[1]).toBe(null);
    expect(validatedTrips[2]).toBe(null);
    expect(validatedTrips[3]).toBe(null);
    expect(validatedTrips[4]).toBe(null);
    expect(validatedTrips[5]).toBe(null);
  });

  test('Distance and duration must be numbers', async () => {
    expect(validatedTrips[11]).toBe(null);
    expect(validatedTrips[12]).toBe(null);
  });

  test('Distance and duration must be at least 10', async () => {
    expect(validatedTrips[6]).toBe(null);
    expect(validatedTrips[7]).toBe(null);
  });

  test('Dates should be valid', async () => {
    expect(validatedTrips[8]).toBe(null);
    expect(validatedTrips[9]).toBe(null);
  });

  test('Return should be after departure', async () => {
    expect(validatedTrips[10]).toBe(null);
  });

  test('Correct entry passes as valid', async () => {
    expect(validatedStations[13]).not.toBe(null);
  });
});

describe('Read, parse, validate and partition stations and trips', () => {
  test('Stations are parsed, validated and partitioned correctly', async () => {
    await fs.copyFile(`${src}/stations.csv`, `${dest}/stations.csv`);
    const validatedStations = await readCsv({
      path: `${dest}/stations.csv`,
      options: {
        headers: STATION_HEADER,
        renameHeaders: true,
      },
      validator: stationValidator,
    });
    const partitionedStations = partition(validatedStations);

    expect(partitionedStations.valid.length).toBe(7);
    expect(partitionedStations.invalid.length).toBe(4);
  });

  test('Trips are parsed, validated and partitioned correctly', async () => {
    await fs.copyFile(`${src}/trips.csv`, `${dest}/trips.csv`);
    const validatedTrips = await readCsv({
      path: `${dest}/trips.csv`,
      options: {
        headers: TRIP_HEADER,
        renameHeaders: true,
      },
      validator: tripValidator,
      validatorData: allValidStations,
    });
    const partitionedTrips = partition(validatedTrips);

    expect(partitionedTrips.valid.length).toBe(99);
    expect(partitionedTrips.invalid.length).toBe(17);
  });
});

describe('Test helper functions', () => {
  test('calculateAverage', () => {
    const avg = calculateAvg(partition(validatedTrips).valid);

    expect(avg).toBe('2.8');
  });

  test('getMostPopular', async () => {
    await fs.copyFile(`${src}/trips.csv`, `${dest}/trips.csv`);
    const validatedTrips = await readCsv({
      path: `${dest}/trips.csv`,
      options: {
        headers: TRIP_HEADER,
        renameHeaders: true,
      },
      validator: tripValidator,
      validatorData: allValidStations,
    });

    const mostPopular = getMostPopular(
      partition(validatedTrips).valid,
      'departureStation'
    );

    const correctOrder = ['135', '3', '16', '19', '29'];
    expect(mostPopular.length).toBe(5);
    expect(mostPopular).toEqual(correctOrder);
  });
});
