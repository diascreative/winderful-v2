'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Energy', {
    _id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    datetime: {
      allowNull: false,
      type: DataTypes.DATE
    },
    demand: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    wind: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    timestamps: false
  });
}
