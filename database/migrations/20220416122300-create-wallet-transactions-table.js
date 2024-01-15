module.exports = {
   up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('wallet_transactions', {
         id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
         },
         walletId: {
            field: 'walled_id',
            type: Sequelize.UUID,
            allowNull: false,
            references: {
               model: 'wallets',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
         },
         referenceId: {
            field: 'reference_id',
            type: Sequelize.UUID,
            allowNull: false,
         },
         type: {
            type: Sequelize.ENUM('withdrawal', 'deposit'),
            allowNull: false,
         },
         credit: {
            type: Sequelize.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
         },
         debit: {
            type: Sequelize.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
         },
         status: {
            type: Sequelize.ENUM('success', 'failed'),
            allowNull: false,
            defaultValue: 'success',
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
      return queryInterface.dropTable('wallet_transactions')
   },
}
