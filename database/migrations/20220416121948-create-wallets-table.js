module.exports = {
   up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('wallets', {
         id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
         },
         ownedBy: {
            field: 'owned_by',
            type: Sequelize.UUID,
            allowNull: false,
         },
         enabledAt: {
            field: 'enabled_at',
            allowNull: true,
            type: Sequelize.DATE,
         },
         disabledAt: {
            field: 'disabled_at',
            allowNull: true,
            type: Sequelize.DATE,
         },
         balance: {
            type: Sequelize.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
         },
         status: {
            type: Sequelize.ENUM('enabled', 'disabled'),
            allowNull: false,
            defaultValue: 'disabled',
         },
         createdAt: {
            field: 'created_at',
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
         },
         updatedAt: {
            field: 'updated_at',
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
         },
         deletedAt: {
            field: 'deleted_at',
            allowNull: true,
            type: Sequelize.DATE,
         },
      })
   },

   down: (queryInterface) => {
      return queryInterface.dropTable('wallets')
   },
}
