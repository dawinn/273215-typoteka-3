'use strict';

const {
  MAX_ID_LENGTH,
} = require(`../../constants`);

const {nanoid} = require(`nanoid`);

class ArticleService {
  constructor(articles) {
    this._articles = articles;
  }

  create(article) {
    const newArticle = Object
    .assign({id: nanoid(MAX_ID_LENGTH), comments: []}, article);

    this._articles.push(newArticle);
    return newArticle;
  }

  drop(id) {
    const articleIndex = this._articles.findIndex((item) => item.id === id);

    if (!~articleIndex) {
      return null;
    }

    return this._articles.splice(articleIndex, 1);
  }

  findAll() {
    return this._articles;
  }

  findOne(id) {
    return this._articles.find((item) => item.id === id);
  }

  update(id, article) {
    const oldArticle = this._articles
    .find((item) => item.id === id);

    return Object.assign(oldArticle, article);
  }

}

module.exports = ArticleService;
