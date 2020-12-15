'use strict';

const {Category} = require(`../models`);

class CategoryService {
  /* todo сделать с выводом ID */
  async findAll() {
    const categories = await Category.findAll({raw: true});
    return categories;
  }
}

module.exports = CategoryService;
