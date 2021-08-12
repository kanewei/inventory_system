'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE } = Sequelize

    await queryInterface.createTable('orders', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: INTEGER, primaryKey: true },
      product_id: { type: STRING, primaryKey: true },
      arrival_date: { type: DATE },
      createdAt: { type: DATE },
      updatedAt: { type: DATE },
      deletedAt: { type: DATE }
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('orders')
  }
}
