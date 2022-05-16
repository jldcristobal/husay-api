const sequelize = require('../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const ArtistCreativeIndustry = sequelize.define('artist_creative_industries', {
  artistId: {
    type: DataTypes.INTEGER
  },
  creativeIndustryId: {
    type: DataTypes.INTEGER
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

  module.exports = ArtistCreativeIndustry