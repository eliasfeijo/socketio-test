const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {}
  };
  User.init({
    id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email:{
      allowNull: false,
      unique: true,
      type: DataTypes.STRING
    },
    password_digest: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};