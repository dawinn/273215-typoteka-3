'use strict';

const express = require(`express`);
const app = express();
const offersRoutes = require(`../routes/offers`);
const myRoutes = require(`../routes/my`);

app.use(`/my`, myRoutes);
app.use(`/offers`, offersRoutes);

const port = 8080;
app.listen(port);

app.get(`/`, (req, res) => res.send(`/`));
app.get(`/register`, (req, res) => res.send(`/register`));
app.get(`/login`, (req, res) => res.send(`/login`));
app.get(`/search`, (req, res) => res.send(`/search`));
