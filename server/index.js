const express = require('express');
require('express-async-errors');
const app = express();

const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');
const middleware = require('./util/middleware');

const testRouter = require('./controllers/apitest');
const dataRouter = require('./controllers/datauploads');
const tripRouter = require('./controllers/trips');
const stationRouter = require('./controllers/stations');
const userRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

app.use(express.json());

app.use('/api/test', testRouter);
app.use('/dataupload', dataRouter);
app.use('/api/trips', tripRouter);
app.use('/api/stations', stationRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

app.use(middleware.errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
