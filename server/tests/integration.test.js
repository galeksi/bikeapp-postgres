const { connectToDatabase } = require('../util/db');
const { sequelize, runMigrations } = require('../util/db');
const supertest = require('supertest');
const app = require('../app');

const { User, Station, Trip } = require('../models/index');
const { users, stations, trips } = require('./seeds');

const api = supertest(app);

beforeAll(async () => {
  await connectToDatabase();

  const tableNames = ['trips', 'stations', 'users', 'sessions', 'migrations'];

  try {
    await sequelize.drop({ tables: tableNames });
    console.log('Tables dropped successfully.');
  } catch (error) {
    console.error('Error dropping tables:', error);
  }

  await runMigrations();

  await Station.bulkCreate(stations);
  await User.bulkCreate(users);
  await Trip.bulkCreate(trips);
}, 10000);

test('test api works', async () => {
  await api.get('/api/test/ping').expect(200);
});

describe('User endpoints', () => {});

describe('Station endpoints', () => {
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
});

describe('Trip endpoints', () => {
  test('all trips are returned', async () => {
    const response = await api.get('/api/trips');

    expect(response.body).toHaveLength(trips.length);
  });
});

describe('Dataupload endpoint', () => {});

afterAll(async () => {
  await sequelize.close();
});
