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

  // ✅ Payment Info fields (for demo purposes)
  cardNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  expiry: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cvv: {
    type: DataTypes.STRING,
    allowNull: true
  },
    isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  }

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
  }
});

// Instance method for password check
User.prototype.validPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;
