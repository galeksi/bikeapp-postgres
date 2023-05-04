const Station = require('./stations');
const Trip = require('./trip');

Station.hasMany(Trip, {
  as: 'forDeparture',
  foreignKey: {
    name: 'departureStation',
    allowNull: false,
  },
});
Station.hasMany(Trip, {
  as: 'forReturn',
  foreignKey: {
    name: 'returnStation',
    allowNull: false,
  },
});
Trip.belongsTo(Station, {
  as: 'forDeparture',
  foreignKey: {
    name: 'departureStation',
    allowNull: false,
  },
});
Trip.belongsTo(Station, {
  as: 'forReturn',
  foreignKey: {
    name: 'returnStation',
    allowNull: false,
  },
});

module.exports = {
  Station,
  Trip,
};
