const { connectToDatabase } = require('../util/db');
const { sequelize, runMigrations } = require('../util/db');
const supertest = require('supertest');
const app = require('../app');

const { User, Station, Trip, Session } = require('../models/index');
const { users, stations, trips } = require('./seeds');

const api = supertest(app);

const userLogin = async (username) => {
  const body = {
    username: username,
    password: 'secret',
  };

  const response = await api.post('/api/login').send(body);

  if (response.body.token) {
    return response.body.token;
  } else {
    return null;
  }
};

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

describe('User endpoints', () => {
  test('User can login', async () => {
    const body = {
      username: 'arendel',
      password: 'secret',
    };

    const response = await api
      .post('/api/login')
      .send(body)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.name).toBe('Aleksi Rendel');
    expect(response.body.username).toBe('arendel');
    expect(response.body.token).toBeDefined();
  });

  test('User can logout', async () => {
    const token = await userLogin('arendel');

    await api
      .delete('/api/logout')
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const session = await Session.findAll({
      where: {
        token: token,
      },
    });

    expect(session).toHaveLength(0);
  });

  test('New user can be created', async () => {
    const body = {
      username: 'hpotter',
      name: 'Harry Potter',
      password: 'secret',
    };

    const response = await api
      .post('/api/users')
      .send(body)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.name).toBe('Harry Potter');
    expect(response.body.username).toBe('hpotter');
    expect(response.body.passwordHash).toBeDefined();
    expect(response.body.passwordHash).not.toBe('secret');
  });
});

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
