'use strict';
const {Router} = require(`express`);
const offersRouter = new Router();

offersRouter.get(`/add`, (req, res) => res.render(`new-post`, {isNavBurger: true}));
offersRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));
offersRouter.get(`/edit/:id`, (req, res) => res.render(`new-post`, {isNavBurger: true}));
offersRouter.get(`/:id`, (req, res) => res.render(`post`));

module.exports = offersRouter;

