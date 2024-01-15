module.exports = (sequelize, DataTypes) => {
   const WalletTransaction = sequelize.define(
      'WalletTransaction',
      {
         id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
         },
         walletId: {
            field: 'walled_id',
            type: DataTypes.UUID,
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
            type: DataTypes.UUID,
            allowNull: false,
         },
         type: {
            type: DataTypes.ENUM('withdrawal', 'deposit'),
            allowNull: false,
         },
         credit: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
         },
         debit: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
         },
         status: {
            type: DataTypes.ENUM('success', 'failed'),
            allowNull: false,
            defaultValue: 'success',
         },
         createdAt: {
            field: 'created_at',
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
         },
         updatedAt: {
            field: 'updated_at',
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
         },
         deletedAt: {
            field: 'deleted_at',
            allowNull: true,
            type: DataTypes.DATE,
         },
      },
      {
         freezeTableName: true,
         tableName: 'wallet_transactions',
         paranoid: true,
      },
   )

   WalletTransaction.associate = (models) => {}

   return WalletTransaction
}
