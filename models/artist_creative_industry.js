const sequelize = require('../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const ArtistCreativeIndustry = sequelize.define('artist_creative_industries', {
  artistId: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  creativeIndustryId: {
    type: DataTypes.INTEGER
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

  module.exports = ArtistCreativeIndustry