'use strict';

const article = require(`./article`);
const articleEdit = require(`./article-edit`);
const comment = require(`./comment`);
const routeParams = require(`./routeParams`);
const user = require(`./user`);

module.exports = {
  article,
  articleEdit,
  comment,
  routeParams,
  user
};
