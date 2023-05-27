const express = require('express');
require('express-async-errors');
const app = express();

const middleware = require('./util/middleware');
const cors = require('cors');

const testRouter = require('./controllers/apitest');
const dataRouter = require('./controllers/datauploads');
const tripRouter = require('./controllers/trips');
const stationRouter = require('./controllers/stations');
const userRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const logoutRouter = require('./controllers/logout');

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === 'production') app.use(express.static('client/build'));

app.use('/api/test', testRouter);
app.use('/api/dataupload', dataRouter);
app.use('/api/trips', tripRouter);
app.use('/api/stations', stationRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
