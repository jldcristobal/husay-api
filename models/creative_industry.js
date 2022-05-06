const sequelize = require('../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const CreativeIndustry = sequelize.define('creative_industries', {
  creativeIndustryId: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  domain: {
    type: DataTypes.STRING,
    allowNull: false
  },
  artistType: {
    type: DataTypes.STRING
  },
  sector: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    allowNull: false,
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

  module.exports = CreativeIndustry