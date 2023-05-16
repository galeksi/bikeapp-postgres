const Station = require('./stations');
const Trip = require('./trip');
const User = require('./user');
const Session = require('./session');

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

User.hasMany(Trip);
Trip.belongsTo(User);

User.hasMany(Session);
Session.belongsTo(User);

module.exports = {
  Station,
  Trip,
  User,
  Session,
};
