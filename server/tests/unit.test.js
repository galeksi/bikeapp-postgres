const fs = require('fs').promises;
const path = require('node:path');

const readCsv = require('../util/dataloader');
const { stationValidator, tripValidator } = require('../util/validators');

const src = path.resolve(__dirname, './csv');
const dest = path.resolve(__dirname, './tmp');

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

  // stations = await readCsv(path.resolve(__dirname, './csv/stations.csv'), {
  //   headers: stationHeader,
  //   renameHeaders: true,
  // });
  // validatedStations = stations.map((station) => stationValidator(station));

  // allValidStations = await readCsv(
  //   path.resolve(__dirname, './csv/allValidStations.csv'),
  //   {
  //     headers: stationHeader,
  //     renameHeaders: true,
  //   }
  // );

  // trips = await readCsv(path.resolve(__dirname, './csv/trips.csv'), {
  //   headers: tripHeader,
  //   renameHeaders: true,
  // });

  // validatedTrips = trips.map((trip) => tripValidator(trip, allValidStations));
  // console.log(validatedTrips);
});

// describe('Reading and parsing csv files', () => {
//   test('Parse stations', async () => {
//     const result = await readCsv(
//       path.resolve(__dirname, './csv/stations.csv'),
//       {
//         headers: stationHeader,
//         renameHeaders: true,
//       }
//     );

//     expect(result.length).toBe(11);
//     expect(Object.keys(result[0])).toEqual(stationHeader);
//   });

//   test('Parse trips', async () => {
//     const result = await readCsv(path.resolve(__dirname, './csv/trips.csv'), {
//       headers: tripHeader,
//       renameHeaders: true,
//     });

//     expect(result.length).toBe(19);
//     expect(Object.keys(result[0])).toEqual(tripHeader);
//   });
// });

// describe('Station validations', () => {
//   test('Number has to be a number', async () => {
//     expect(validatedStations[0]).toBe(null);
//   });

//   test('Number has to be greater than zero', async () => {
//     expect(validatedStations[1]).toBe(null);
//   });

//   test('Empty fields are corrected', async () => {
//     expect(validatedStations[2].kaupunki).toBe('Helsinki');
//     expect(validatedStations[2].stad).toBe('Helsingfors');
//     expect(validatedStations[2].operator).toBe('CityBike Finland');
//   });

//   test('Coordinates are valid', async () => {
//     expect(validatedStations[3]).toBe(null);
//     expect(validatedStations[4]).toBe(null);
//   });
// });

// describe('Trip validations', () => {
//   test('Valid stations number for departure or return', async () => {
//     expect(validatedTrips[0]).toBe(null);
//     expect(validatedTrips[1]).toBe(null);
//     expect(validatedTrips[2]).toBe(null);
//     expect(validatedTrips[3]).toBe(null);
//     expect(validatedTrips[4]).toBe(null);
//     expect(validatedTrips[5]).toBe(null);
//   });

//   test('Distance and duration must be at least 10', async () => {
//     expect(validatedTrips[6]).toBe(null);
//     expect(validatedTrips[7]).toBe(null);
//   });

//   test('Dates should be valid', async () => {
//     expect(validatedTrips[8]).toBe(null);
//     expect(validatedTrips[9]).toBe(null);
//   });

//   test('Dates should be valid', async () => {
//     expect(validatedTrips[10]).toBe(null);
//   });
// });

// describe('Read, parse and validate stations and trips', () => {
//   test('Stations are parsed and validated correct', async () => {
//     const validatedStations = await readCsv(
//       path.resolve(__dirname, './csv/stations.csv'),
//       {
//         headers: stationHeader,
//         renameHeaders: true,
//       },
//       stationValidator
//     );

//     expect(validatedStations.length).toBe(7);
//   });

//   test('Trips are parsed and validated correct', async () => {
//     const validatedTrips = await readCsv(
//       path.resolve(__dirname, './csv/trips.csv'),
//       {
//         headers: tripHeader,
//         renameHeaders: true,
//       },
//       tripValidator,
//       allValidStations
//     );

//     expect(validatedTrips.length).toBe(8);
//   });
// });
