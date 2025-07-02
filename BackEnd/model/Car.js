// models/Car.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../Database/db');

const Car = sequelize.define('Car', {
  // Example fields — adjust as needed
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
  // Add other fields like color, VIN, etc.
}, {
  tableName: 'Cars', // optional, for exact DB table name
  timestamps: true,
});

module.exports = Car;
