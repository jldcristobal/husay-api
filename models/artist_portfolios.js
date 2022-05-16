const sequelize = require('../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const ArtistPortfolio = sequelize.define('artist_portfolios', {
  artistId: {
    type: DataTypes.INTEGER
  },
  filename: {
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

  module.exports = ArtistPortfolio