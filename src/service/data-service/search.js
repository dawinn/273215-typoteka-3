'use strict';

class SearchService {
  constructor(article) {
    this._article = article;
  }

  findAll(searchText) {
    return this._article.filter((article) => article.title.includes(searchText));
  }

}

module.exports = SearchService;
