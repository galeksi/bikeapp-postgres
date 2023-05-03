const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('trips', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      departure: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      return: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      distance: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
    await queryInterface.createTable('stations', {
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
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
    await queryInterface.addColumn('trips', 'departure_station', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'stations', key: 'id' },
    });
    await queryInterface.addColumn('trips', 'return_station', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'stations', key: 'id' },
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('trips');
    await queryInterface.dropTable('stations');
  },
};
