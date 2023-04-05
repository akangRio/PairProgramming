'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Coffee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Coffee.hasMany(models.Order, { foreignKey: 'CoffeeId' })
      // define association here
    }
  }
  Coffee.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    coffeeCup: DataTypes.BOOLEAN,
    price: DataTypes.INTEGER,
    category: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Coffee',
  });
  return Coffee;
};