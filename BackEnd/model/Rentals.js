const { DataTypes } = require('sequelize');
const sequelize = require('../Database/db').sequelize;
const User = require('./User');
const Car = require('./Car'); 

const Rental = sequelize.define('Rental', {
  rentalDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  returnDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'cancelled','inactive'),
    defaultValue: 'inactive',
  },
});

Rental.belongsTo(User, { foreignKey: 'userId' });
Rental.belongsTo(Car, { foreignKey: 'carId' });

module.exports = Rental;
