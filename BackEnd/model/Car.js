// models/Car.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../Database/db');
const Rental = require('./Rentals'); // Adjust path as needed

const Car = sequelize.define('Car', {
  make: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pricePerDay: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  fuelType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING, // Store filename or cloud URL
    allowNull: true,
  },
}, {
  tableName: 'Cars',
  timestamps: true,
});

module.exports = Car;
