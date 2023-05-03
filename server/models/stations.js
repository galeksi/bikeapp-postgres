const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../util/db');

class Station extends Model {}

Station.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fid: {
      type: DataTypes.INTEGER,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    nimi: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    namn: {
      type: DataTypes.TEXT,
    },
    name: {
      type: DataTypes.TEXT,
    },
    osoite: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    adress: {
      type: DataTypes.TEXT,
    },
    kaupunki: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    stad: {
      type: DataTypes.TEXT,
    },
    operator: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    long: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    lat: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'station',
  }
);

module.exports = Station;
