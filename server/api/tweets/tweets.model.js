'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Tweets', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    percentage: DataTypes.STRING,
    equivalentIndex: DataTypes.INTEGER,
    message: DataTypes.STRING
  });
}
