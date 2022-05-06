'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('artists', {
      artistId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      middleName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      mobileNumber: {
        type: Sequelize.INTEGER
      },
      dateOfBirth: {
        type: Sequelize.DATE
      },
      cityOfResidencePermanent: {
        type: Sequelize.STRING
      },
      provincePermanent: {
        type: Sequelize.STRING
      },
      regionPermanent: {
        type: Sequelize.STRING
      },
      cityOfResidenceCurrent: {
        type: Sequelize.STRING
      },
      provinceCurrent: {
        type: Sequelize.STRING
      },
      regionCurrent: {
        type: Sequelize.STRING
      },
      socialMediaPage1: {
        type: Sequelize.STRING
      },
      socialMediaPage2: {
        type: Sequelize.STRING
      },
      socialMediaPage3: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('artists');
  }
};