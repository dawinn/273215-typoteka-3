'use strict';
const {sequelize} = require(`../db-connect`);

const model = () => {
  const Category = require(`./category`)(sequelize);
  const Comment = require(`./comment`)(sequelize);
  const Article = require(`./article`)(sequelize);
  const Picture = require(`./picture`)(sequelize);
  const User = require(`./user`)(sequelize);

  Article.belongsToMany(Category, {
    through: `articles_categories`,
    as: `categories`,
    foreignKey: `article_id`,
    timestamps: false,
    onDelete: `CASCADE`,
  });

  Category.belongsToMany(Article, {
    through: `articles_categories`,
    as: `articles`,
    foreignKey: `category_id`,
    timestamps: false,
    onDelete: `CASCADE`,
  });

  Article.Picture = Article.belongsTo(Picture, {
    foreignKey: `picture_id`,
    as: `picture`,
  });

  Picture.hasMany(Article, {
    foreignKey: `picture_id`,
    as: `picture`,
  });

  Comment.belongsTo(Article, {
    foreignKey: `article_id`,
    as: `comments`,
    onDelete: `CASCADE`,
  });

  Article.hasMany(Comment, {
    foreignKey: `article_id`,
    as: `comments`,
  });

  Comment.belongsTo(User, {
    foreignKey: `user_id`,
    as: `comment_user`,
  });

  User.hasMany(Comment, {
    foreignKey: `user_id`,
    as: `comment_user`,
  });


  return {
    Category,
    Comment,
    Article,
    Picture,
    User,
  };
};

module.exports = model();
