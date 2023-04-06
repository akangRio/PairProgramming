'use strict';
const {
  Model , Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Profile.belongsTo(models.User, { foreignKey: 'UserId' })
      Profile.hasMany(models.Order, { foreignKey: 'ProfileId' })
      // define association here
    }

    static listAll(search){
      let option = {
        include : [{
          model : sequelize.models.Order,
          include : [{
            model : sequelize.models.Coffee
          }]
        },
        {
          model : sequelize.models.User
        }]
      }
      console.log(search);
      if(search){
        option.where = {name:{[Op.iLike]:`%${search}%`}}
      }

      return Profile.findAll(option)
    }

  }
  Profile.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Name is required!'
        }, 
        notEmpty: {
          msg: 'Name is required!'
        }
      }
    },
    address: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    phone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};