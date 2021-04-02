'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = (sequelize) => {
  const Picture = require(`./picture`)(sequelize);

  class Article extends Model {}
  Article.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    announce: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullText: {
      type: DataTypes.STRING,
      field: `full_text`,
      allowNull: false,
    },
    pictureId: {
      type: DataTypes.INTEGER,
      field: `picture_id`,
      reference: {
        model: Picture,
        key: `id`
      }
    },
    createDate: {
      type: DataTypes.DATE,
      field: `create_date`,
      allowNull: false,
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    sequelize,
    timestamps: false,
    paranoid: false,
    tableName: `articles`
  });

  return Article;
};

