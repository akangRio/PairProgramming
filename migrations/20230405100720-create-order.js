'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      basePrice: {
        type: Sequelize.INTEGER
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      address: {
        type: Sequelize.STRING
      },
      ProfileId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Profiles',
          key: 'id'
        }
      },
      CoffeeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Coffees',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Orders');
  }
};