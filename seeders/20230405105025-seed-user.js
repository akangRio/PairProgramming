'use strict';
const fs = require('fs')
const bcryptjs = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up (queryInterface, Sequelize) {
    const data = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8')).map(user => {
      user.createdAt = new Date()
      user.updatedAt = new Date()

      const salt=bcryptjs.genSaltSync(10)
      const hash=bcryptjs.hashSync(user.password, salt)

      user.password = hash
      return user
    })
    return queryInterface.bulkInsert('Users', data, {})
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {})
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

