const express = require('express');
require('express-async-errors');
const app = express();

const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');

const testRouter = require('./controllers/test');
const dataRouter = require('./controllers/datauploads');
const tripRouter = require('./controllers/trips');
const stationRouter = require('./controllers/stations');

app.use(express.json());

app.use('/api/test', testRouter);
app.use('/dataupload', dataRouter);
app.use('/api/trips', tripRouter);
app.use('/api/stations', stationRouter);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
