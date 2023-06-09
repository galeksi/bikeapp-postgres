const isValidCoordinates = require('is-valid-coordinates');
const moment = require('moment');

const stationValidator = (obj) => {
  // Empty fields are corrected for this dataset to have consistent database entries
  if (obj.kaupunki === ' ') obj.kaupunki = 'Helsinki';
  if (obj.stad === ' ') obj.stad = 'Helsingfors';
  if (obj.operator === ' ') obj.operator = 'CityBike Finland';

  // Station number and coordinates are validated
  if (
    isNaN(Number.parseFloat(obj.number)) ||
    Number.parseFloat(obj.number) <= 0
  )
    return null;
  if (!isValidCoordinates(Number(obj.long), Number(obj.lat))) return null;

  return obj;
};

const tripValidator = (obj, stations) => {
  // Distance and duration are validated
  if (isNaN(Number(obj.distance))) {
    return null;
  } else {
    obj.distance = Math.floor(Number(obj.distance));
  }

  if (isNaN(Number(obj.duration))) {
    return null;
  } else {
    obj.duration = Math.floor(Number(obj.duration));
  }

  if (obj.distance < 10 || obj.duration < 10) return null;

  // Trips with unvalid date strings are discarded
  if (!moment(obj.departure).isValid() || !moment(obj.return).isValid()) {
    return null;
  }

  // Trips with return date before departure are discarded
  if (Date.parse(obj.departure) - Date.parse(obj.return) >= 0) return null;

  // Trips from and to stations are refrenced to stationdata from DB, otherwise discarded
  const depStation = stations.find(
    (s) => s.number === Number(obj.departureStationNumber)
  );
  if (depStation) {
    obj.departureStation = depStation.id;
  } else {
    return null;
  }

  const retStation = stations.find(
    (s) => s.number === Number(obj.returnStationNumber)
  );
  if (retStation) {
    obj.returnStation = retStation.id;
  } else {
    return null;
  }

  // Because departue and return stations are refrenced in database the fields are discarded
  delete obj.departureStationNumber;
  delete obj.returnStationNumber;
  delete obj.departureStationName;
  delete obj.returnStationName;

  return obj;
};

const partition = (data) => {
  const valid = [];
  const invalid = [];

  data.forEach((element, index) => {
    if (element === null) {
      invalid.push(index + 1);
    } else {
      valid.push(element);
    }
  });

  return {
    valid: valid,
    invalid: invalid,
  };
};

module.exports = { stationValidator, tripValidator, partition };
