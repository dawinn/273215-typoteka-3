'use strict';

const express = require(`express`);
const path = require(`path`);
const {getData} = require(`./request`);
const {dateFormat} = require(`../utils`);

const app = express();
const articlesRoutes = require(`./routes/articles`);
const myRoutes = require(`./routes/my`);

const PUBLIC_DIR = `public`;
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.urlencoded({extended: false}));

app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);

const port = 8080;
app.listen(port);

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

/* главная */
app.get(`/`, async (req, res) => {
  /*  получение данных */
  const categoriesData = await getData(`/api/categories`);
  const categories = categoriesData.map((item) => ({
    ...item,
    count: 13
  }));

  const {articles} = await getData(`/api/articles/?limit=4`);

  const {articles: popList} = await getData(`/api/articles/?limit=2`);
  const populars = popList.map((item) => ({
    id: item.id,
    text: item.announce,
    count: item.comments.length,
  }));

  const lastComments = {};
  lastComments.length = 4;

  res.render(`main`, {
    categories,
    articles,
    populars,
    lastComments
  });
});

app.get(`/categories`, (req, res) => res.render(`all-categories`, {isNavBurger: true}));
app.get(`/register`, (req, res) => res.render(`sign-up`));
app.get(`/login`, (req, res) => res.render(`login`));
app.get(`/search`, async (req, res) => {
  let searchResult = [];
  if (req.query.query) {
    const {searchResult: searchResultData} = await getData(`/api${req.url}`);
    searchResult = searchResultData && searchResultData.map((item) => ({
      id: item.id,
      title: item.title.replace(req.query.query, `<b>${req.query.query}</b>`),
      dateTime: dateFormat(Date.parse(item.createDate), `%Y-%m-%dT%H:%M`),
      dateView: dateFormat(Date.parse(item.createDate), `%d.%m.%Y, %H:%M`),
    }));
  }
 console.log(`searchResult`, searchResult);
  res.render(`search`, {isNavBurger: true, query: req.query.query, searchResult: searchResult || []});
});
