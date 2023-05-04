const csv = require('fast-csv');
const fs = require('fs');

const readCsv = ({ path, options, validator, validatorData }) => {
  return new Promise((resolve, reject) => {
    const fileRows = [];

    csv
      .parseFile(path, options)
      .on('error', (error) => {
        console.error(error);
        return reject(error);
      })
      .on('data', (row) => {
        const validData = validator ? validator(row, validatorData) : row;
        if (validData) fileRows.push(validData);
      })
      .on('end', () => {
        // if (process.env.NODE_ENV === !'test') fs.unlinkSync(path);
        fs.unlinkSync(path);
        resolve(fileRows);
      });
  });
};

module.exports = readCsv;
