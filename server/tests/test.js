const fs = require('fs').promises;
const path = require('node:path');

const src = path.resolve(__dirname, './csv');
const dest = path.resolve(__dirname, './tmp');

const copyFiles = async () => {
  await fs.copyFile(
    `${src}/allValidStations.csv`,
    `${dest}/allValidStations.csv`
  );

  await fs.copyFile(`${src}/stations.csv`, `${dest}/stations.csv`);

  await fs.copyFile(`${src}/trips.csv`, `${dest}/trips.csv`);
};

copyFiles();
