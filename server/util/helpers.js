var _ = require('lodash');

// Calculates average distance in km for given trips
const calculateAvg = (trips) => {
  const distance = trips.reduce((a, b) => a + b.distance, 0);
  return (distance / trips.length / 1000).toFixed(1);
};

// Counts all departure or return stations for given trips, sorts them and returns five highest
const getMostPopular = (trips, station) => {
  const counted = _.countBy(trips, station);
  const sorted = Object.entries(counted)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  return sorted.map((s) => s[0]);
};

module.exports = { calculateAvg, getMostPopular };
