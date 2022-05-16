const sequelize = require('../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const Artist = sequelize.define('artists', {
  artistId: {
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  username: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    validate: {isEmail: true}
  },
  password: {
    type: DataTypes.STRING
  },
  salt: {
    type: DataTypes.STRING
  },
  firstName: {
    type: DataTypes.STRING
  },
  middleName: {
    type: DataTypes.STRING
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mobileNumber: {
    type: DataTypes.STRING
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY
  },
  cityOfResidencePermanent: {
    type: DataTypes.STRING
  },
  provincePermanent: {
    type: DataTypes.STRING
  },
  regionPermanent: {
    type: DataTypes.STRING
  },
  cityOfResidenceCurrent: {
    type: DataTypes.STRING
  },
  provinceCurrent: {
    type: DataTypes.STRING
  },
  regionCurrent: {
    type: DataTypes.STRING
  },
  socialMediaPage1: {
    type: DataTypes.STRING,
    validate: {isUrl: true}
  },
  socialMediaPage2: {
    type: DataTypes.STRING,
    validate: {isUrl: true}
  },
  socialMediaPage3: {
    type: DataTypes.STRING,
    validate: {isUrl: true}
  },
  createdAt: {
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
    freezeTableName: true,
    timestamps: false
  });

  module.exports = Artist