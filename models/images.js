'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Images extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Images.init({
    imageId: DataTypes.INTEGER,
    earthDate: DataTypes.STRING,
    sol: DataTypes.INTEGER,
    camera: DataTypes.STRING,
    mission: DataTypes.STRING,
    path: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Images',
  });
  return Images;
};