'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE } = Sequelize

    await queryInterface.createTable('users', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      email: { type: STRING, allowNull: false, unique: true },
      password: { type: STRING, allowNull: false } ,
      created_at: { type: DATE },
      updated_at: { type: DATE }
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('users')
  }
}
