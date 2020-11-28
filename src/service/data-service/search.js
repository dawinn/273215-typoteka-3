'use strict';
const {Sequelize, Op} = require(`sequelize`);

class SearchService {
  constructor(article) {
    this.article = article;
  }
  async findAll(searchText) {
    const articles = await this.article.findAll({
      where: Sequelize.where(
          Sequelize.fn(`lower`, Sequelize.col(`title`)),
          {
            [Op.like]: `%${searchText.toLowerCase()}%`
          }
      )
    });
    return articles;
  }

}

module.exports = SearchService;
