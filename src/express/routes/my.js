'use strict';
const {Router} = require(`express`);
const myRouter = new Router();
const {getData} = require(`../request`);
const {dateFormat} = require(`../../utils`);

myRouter.get(`/`, async (req, res) => {
  const myNotesData = await getData(`/api/articles`);
  const myNotes = myNotesData.map((item) => ({
    id: item.id,
    text: item.announce,
    dateTime: dateFormat(Date.parse(item.createdDate), `%Y-%m-%dT%H:%M`),
    dateView: dateFormat(Date.parse(item.createdDate), `%d.%m.%Y, %H:%M`),
  }));

  res.render(`my`, {isNavBurger: true, myNotes});
});

myRouter.get(`/comments`, async (req, res) => {
  const articlesData = await getData(`/api/articles`);
  articlesData.length = 3;

  /* TODO rewrite on query to BD */
  const comments = [].concat(...await Promise.all(
    articlesData.map(async (item) => {
      const commentData = await getData(`/api/articles/${item.id}/comments`);
      return commentData.map((comment) => ({
        ...comment,
        articleId: item.id,
        title: item.title,
        dateTime: dateFormat(Date.parse(item.createdDate), `%Y-%m-%dT%H:%M`),
        dateView: dateFormat(Date.parse(item.createdDate), `%d.%m.%Y, %H:%M`),
      }));
    })
  ));

  res.render(`comments`, {isNavBurger: true, comments});
});

module.exports = myRouter;
