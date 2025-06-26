const { DataTypes } = require('sequelize');
const sequelize = require('../Database/db').sequelize;
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  firstName: { 
    type: DataTypes.STRING, 
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  surname: { 
    type: DataTypes.STRING, 
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true, 
    validate: { 
      isEmail: true,
      notEmpty: true
    } 
  },
  username: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  dob: { 
    type: DataTypes.DATEONLY, 
    allowNull: false 
  },
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  },
  instanceMethods: {
    validPassword: async function(password) {
      return await bcrypt.compare(password, this.password);
    }
  }
});

// Add a method to compare passwords
User.prototype.validPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;