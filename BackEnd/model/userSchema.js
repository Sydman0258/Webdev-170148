const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection').sequelize; // adjust path as needed
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  firstName: { type: DataTypes.STRING, allowNull: false },
  surname: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  dob: { type: DataTypes.DATEONLY, allowNull: false },
}, {
  hooks: {
    beforeCreate: async (user) => {
      // hash password before saving
      if(user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

module.exports = User;
