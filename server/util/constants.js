const STATION_HEADER = [
  'fid',
  'number',
  'nimi',
  'namn',
  'name',
  'osoite',
  'adress',
  'kaupunki',
  'stad',
  'operator',
  'capacity',
  'long',
  'lat',
];

const TRIP_HEADER = [
  'departure',
  'return',
  'departureStationNumber',
  'departureStationName',
  'returnStationNumber',
  'returnStationName',
  'distance',
  'duration',
];

module.exports = {
  STATION_HEADER,
  TRIP_HEADER,
};
