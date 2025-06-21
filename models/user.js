'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      address: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      additional_info: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'User',
     underscored: true,
    }
  );
  return User;
};