const express = require('express');
require('express-async-errors');
const app = express();

const middleware = require('./util/middleware');

const testRouter = require('./controllers/apitest');
const dataRouter = require('./controllers/datauploads');
const tripRouter = require('./controllers/trips');
const stationRouter = require('./controllers/stations');
const userRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const logoutRouter = require('./controllers/logout');

app.use(express.json());

app.use('/api/test', testRouter);
app.use('/dataupload', dataRouter);
app.use('/api/trips', tripRouter);
app.use('/api/stations', stationRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);

app.use(middleware.errorHandler);

module.exports = app;
