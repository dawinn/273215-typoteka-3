'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = (sequelize) => {
  const Article = require(`src/service/models/article`)(sequelize);
  const Category = require(`./category`)(sequelize);

  class ArticlesCategory extends Model {}
  ArticlesCategory.init({
    articleId: {
      type: DataTypes.INTEGER,
      field: `article_id`,
      reference: {
        model: Article,
        key: `id`
      },
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      field: `category_id`,
      reference: {
        model: Category,
        key: `id`
      },
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: false,
    paranoid: false,
    tableName: `articles_categories`,
  });

  return ArticlesCategory;
};

