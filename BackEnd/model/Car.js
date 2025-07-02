// models/Car.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../Database/db');

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
}, {
  tableName: 'Cars', 
  timestamps: true,
});

module.exports = Car;
