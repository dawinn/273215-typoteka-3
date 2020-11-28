'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = (sequelize) => {
  const Article = require(`./article`)(sequelize);
  const User = require(`./user`)(sequelize);

  class Comment extends Model {}
  Comment.init({
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    articleId: {
      type: DataTypes.INTEGER,
      field: `article_id`,
      reference: {
        model: Article,
        key: `id`
      },
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      field: `user_id`,
      reference: {
        model: User,
        key: `id`
      },
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: false,
    paranoid: false,
    tableName: `comments`,
  });

  return Comment;
};

