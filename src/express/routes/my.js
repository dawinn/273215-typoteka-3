'use strict';
const {Router} = require(`express`);
const myRouter = new Router();
const {getData} = require(`../request`);
const {dateFormat} = require(`../../utils`);
const privateRoute = require(`../middlewares/private-route`);

myRouter.get(`/`, privateRoute, async (req, res) => {
  const {articles: myNotesData, ...paginationData} = await getData(`/api/articles${req.url}`);
  const myNotes = myNotesData.map((item) => ({
    id: item.id,
    text: item.announce,
    dateTime: dateFormat(Date.parse(item.createDate), `%Y-%m-%dT%H:%M`),
    dateView: dateFormat(Date.parse(item.createDate), `%d.%m.%Y, %H:%M`),
  }));

  res.render(`my`, {isNavBurger: true, myNotes, ...paginationData});
});

myRouter.get(`/comments`, privateRoute, async (req, res) => {
  const {articles: articlesData} = await getData(`/api/articles`);
  articlesData.length = 3;

  /* TODO rewrite on query to BD */
  const comments = [].concat(...await Promise.all(
      articlesData.map(async (item) => {
        const commentData = await getData(`/api/articles/${item.id}/comments`);
        return commentData.map((comment) => ({
          ...comment,
          articleId: item.id,
          title: item.title,
          dateTime: dateFormat(Date.parse(item.createDate), `%Y-%m-%dT%H:%M`),
          dateView: dateFormat(Date.parse(item.createDate), `%d.%m.%Y, %H:%M`),
        }));
      })
  ));

  res.render(`comments`, {isNavBurger: true, comments});
});

module.exports = myRouter;
