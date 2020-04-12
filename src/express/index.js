'use strict';

const express = require(`express`);
const path = require(`path`);
const app = express();
const offersRoutes = require(`./routes/articles`);
const myRoutes = require(`./routes/my`);

const PUBLIC_DIR = `public`;
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.use(`/my`, myRoutes);
app.use(`/offers`, offersRoutes);

const port = 8080;
app.listen(port);

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.get(`/`, (req, res) => res.render(`main`));
app.get(`/categories`, (req, res) => res.render(`all-categories`, {isNavBurger: true}));
app.get(`/register`, (req, res) => res.render(`sign-up`));
app.get(`/login`, (req, res) => res.render(`login`));
app.get(`/search`, (req, res) => res.render(`search-result`, {isNavBurger: true}));
