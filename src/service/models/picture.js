'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = (sequelize) => {
  class Picture extends Model {}
  Picture.init({
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image2x: {
      type: DataTypes.STRING,
    },
    background: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    timestamps: false,
    paranoid: false,
    tableName: `pictures`
  });

  return Picture;
};

