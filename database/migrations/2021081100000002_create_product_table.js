'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { STRING } = Sequelize

    await queryInterface.createTable('products', {
      id: { type: STRING, primaryKey: true},
      currentInventory: { type: STRING, allowNull: false },
      defaultInventory: { type: STRING, allowNull: false },
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('products')
  }
}
