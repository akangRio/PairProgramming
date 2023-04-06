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

    get totalPrice(){
      return this.basePrice * this.quantity
    }
  }
  Order.init({
    basePrice: DataTypes.INTEGER,
    quantity: {
      type : DataTypes.INTEGER,
      validate : {
        customValidator(quantity){
          if(quantity < 0){
            throw new Error("quantity cant be below zero");
          }
        }
      }
    },
    address: DataTypes.STRING,
    ProfileId: DataTypes.INTEGER,
    CoffeeId: {
      type :DataTypes.INTEGER,
      unique : true
    }
  }, {
    sequelize,
    modelName: 'Order',
  });

  Order.beforeCreate(order => {
    order.quantity = 1
  })

  return Order;
};