'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('artist_creative_industries', {
      artistId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      creativeIndustryId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('artist_creative_industries');
  }
};