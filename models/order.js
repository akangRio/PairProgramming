'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.Profile, { foreignKey: 'ProfileId' })
      Order.belongsTo(models.Coffee, { foreignKey: 'CoffeeId' })
      // define association here
    }
  }
  Order.init({
    basePrice: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    address: DataTypes.STRING,
    ProfileId: DataTypes.INTEGER,
    CoffeeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};