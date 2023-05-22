const { connectToDatabase } = require('../util/db');
// const { Op } = require('sequelize');
const supertest = require('supertest');
const app = require('../app');

const { User, Station, Trip } = require('../models/index');
const { users, stations, trips } = require('./seeds');

// connectToDatabase();

const api = supertest(app);

beforeAll(async () => {
  await connectToDatabase();
  await Trip.destroy({
    where: {},
  });
  await Station.destroy({
    where: {},
  });
  await User.destroy({
    where: {},
  });

  const newStations = await Station.bulkCreate(stations);
  const newUsers = await User.bulkCreate(users);
});

test('test api works', async () => {
  await api.get('/api/test/ping').expect(200);
});

test('station api works', async () => {
  await api
    .get('/api/stations')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all stations are returned', async () => {
  const response = await api.get('/api/stations');

  expect(response.body).toHaveLength(stations.length);
});

// setTimeout(() => {
//   afterAll(async () => {
//     try {
//       await sequelize.close();
//       console.log('database connection closed');
//     } catch (error) {
//       console.log(error);
//     }
//   });
// }, 5000);
