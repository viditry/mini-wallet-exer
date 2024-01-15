module.exports = (sequelize, DataTypes) => {
   const Wallet = sequelize.define(
      'Wallet',
      {
         id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
         },
         ownedBy: {
            field: 'owned_by',
            type: DataTypes.UUID,
            allowNull: false,
         },
         enabledAt: {
            field: 'enabled_at',
            allowNull: true,
            type: DataTypes.DATE,
         },
         disabledAt: {
            field: 'disabled_at',
            allowNull: true,
            type: DataTypes.DATE,
         },
         balance: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
         },
         status: {
            type: DataTypes.ENUM('enabled', 'disabled'),
            allowNull: false,
            defaultValue: 'disabled',
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
         tableName: 'wallets',
         paranoid: true,
      },
   )

   Wallet.associate = (models) => {}

   return Wallet
}
