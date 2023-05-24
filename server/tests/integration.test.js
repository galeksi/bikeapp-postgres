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

const userLogout = async (token) => {
  await Session.destroy({
    where: {
      token: token,
    },
  });
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

    await userLogout(response.body.token);
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

    const allUsers = await User.findAll();
    expect(allUsers).toHaveLength(users.length + 1);

    await User.destroy({
      where: {
        username: 'hpotter',
      },
    });
  });

  test('Disabled user cant log in', async () => {
    const body = {
      username: 'ppan',
      password: 'secret',
    };

    const response = await api
      .post('/api/login')
      .send(body)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toContain(
      'account disabled, please contact admin'
    );
  });

  test('admin can get all users', async () => {
    const token = await userLogin('arendel');

    const response = await api
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(users.length);

    await userLogout(token);
  });

  test('normal user cant get all users', async () => {
    const token = await userLogin('mpoppins');

    await api
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    await userLogout(token);
  });

  test('normal user can get own data', async () => {
    const token = await userLogin('mpoppins');

    const response = await api
      .get('/api/users/3')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.name).toBe('Marry Poppins');

    await userLogout(token);
  });

  test('admin can disable user', async () => {
    const token = await userLogin('arendel');

    const body = {
      disabled: true,
    };

    const response = await api
      .put('/api/users/disabled/3')
      .send(body)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.disabled).toBe(true);

    await userLogout(token);
  });
});

describe('Station endpoints', () => {
  test('all stations are returned', async () => {
    const response = await api
      .get('/api/stations')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(stations.length);
  });

  test('stations statistics are returned', async () => {
    const keys = [
      'stationId',
      'startTotal',
      'returnTotal',
      'startAvg',
      'returnAvg',
      'popularReturn',
      'popularDeparture',
    ];

    const response = await api
      .get('/api/stations/1/stats')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(Object.keys(response.body)).toEqual(keys);
  });

  test('admin can create new station', async () => {
    const newStation = {
      nimi: 'TEST',
      namn: 'Västrahamnsgatan',
      name: 'Länsisatamankatu',
      osoite: 'Länsisatamankatu 19',
      adress: 'Västrahamnsgatan 19',
      kaupunki: 'Helsinki',
      stad: 'Helsingfors',
      operator: 'CityBike Finland',
      capacity: 16,
      long: 24.9096920006591,
      lat: 60.158927591706,
    };

    const token = await userLogin('arendel');

    const response = await api
      .post('/api/stations/')
      .send(newStation)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.nimi).toBe('TEST');
    expect(response.body.id).toBe(11);
    expect(response.body.number).toBe(111);

    await Station.destroy({
      where: {
        id: 11,
      },
    });

    await userLogout('arendel');
  });

  test('admin can update station capacity', async () => {
    const token = await userLogin('arendel');
    const newCapacity = { capacity: 100 };

    const response = await api
      .put('/api/stations/1')
      .send(newCapacity)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.capacity).toBe(100);

    await userLogout('arendel');
  });

  test('admin can delete unrefrenced station', async () => {
    const token = await userLogin('arendel');

    const newStation = {
      nimi: 'TODELETE',
      namn: 'Västrahamnsgatan',
      name: 'Länsisatamankatu',
      osoite: 'Länsisatamankatu 19',
      adress: 'Västrahamnsgatan 19',
      kaupunki: 'Helsinki',
      stad: 'Helsingfors',
      operator: 'CityBike Finland',
      capacity: 16,
      long: 24.9096920006591,
      lat: 60.158927591706,
    };

    const response = await api
      .post('/api/stations/')
      .send(newStation)
      .set('Authorization', `Bearer ${token}`);

    await api
      .delete(`/api/stations/${response.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const allStations = await Station.findAll();

    expect(allStations).toHaveLength(10);

    await userLogout('arendel');
  });
});

describe('Trip endpoints', () => {
  test('all trips are returned', async () => {
    const response = await api.get('/api/trips').expect(200);

    expect(response.body).toHaveLength(trips.length);
  });

  test('single trip is returned', async () => {
    const response = await api
      .get('/api/trips/1')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.id).toBe(1);
  });
});

describe('Dataupload endpoint', () => {});

afterAll(async () => {
  await sequelize.close();
});
