const Station = require('./stations');
const Trip = require('./trip');

Station.hasMany(Trip);
Trip.belongsTo(Station);

module.exports = {
  Station,
  Trip,
};
