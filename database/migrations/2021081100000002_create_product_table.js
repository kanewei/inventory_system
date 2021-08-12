'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { STRING, DATE } = Sequelize

    await queryInterface.createTable('products', {
      id: { type: STRING, primaryKey: true},
      currentInventory: { type: STRING, allowNull: false },
      defaultInventory: { type: STRING, allowNull: false },
      createdAt: { type: DATE },
      updatedAt: { type: DATE },
      deletedAt: { type: DATE }
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('products')
  }
}
