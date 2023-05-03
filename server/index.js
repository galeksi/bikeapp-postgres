const express = require('express');
const app = express();

const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');

const testRouter = require('./controllers/test');
const dataRouter = require('./controllers/datauploads');

app.use(express.json());

app.use('/api/test', testRouter);
app.use('/dataupload', dataRouter);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
