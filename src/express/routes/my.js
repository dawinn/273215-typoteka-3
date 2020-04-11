'use strict';
const {Router} = require(`express`);
const myRouter = new Router();

myRouter.get(`/`, (req, res) => res.render(`my`, {isNavBurger: true}));
myRouter.get(`/comments`, (req, res) => res.render(`comments`, {isNavBurger: true}));

module.exports = myRouter;
