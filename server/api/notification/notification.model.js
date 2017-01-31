'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Notification', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    gcmId: DataTypes.STRING
  });
}
