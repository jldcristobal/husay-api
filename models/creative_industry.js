const sequelize = require('../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const CreativeIndustry = sequelize.define('creative_industries', {
  creativeIndustryId: {
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  domain: {
    type: DataTypes.STRING,
  },
  artistType: {
    type: DataTypes.STRING
  },
  sector: {
    type: DataTypes.STRING,
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

  module.exports = CreativeIndustry