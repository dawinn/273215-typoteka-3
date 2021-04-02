'use strict';
const {Router} = require(`express`);
const articlesRouter = new Router();
const {getData, sendData, putData} = require(`../request`);
const upload = require(`../middlewares/uploader`);
const {dateFormat} = require(`../../utils`);

articlesRouter.get(`/add`, async (req, res) => {
  const allCategories = await getData(`/api/categories`);

  const categories = allCategories.map((item) => {
    return {
      ...item,
      checked: false,
    };
  });
  res.render(`new-post`, {isNavBurger: true, article: {}, categories, errors: {}});
});
articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const article = await getData(`/api/articles/${req.params.id}`);
  const allCategories = await getData(`/api/categories`);

  const categories = allCategories.map((item) => {
    return {
      ...item,
      checked: article.categories.some((category) => (category.id === item.id)),
    };
  });
  res.render(`new-post`, {isNavBurger: true, article, categories, errors: {}});
});

articlesRouter.get(`/:id`, async (req, res) => {
  const article = await getData(`/api/articles/${req.params.id}`);

  if (article) {
    /*  получение данных */
    const categories = article.categories.map((item) => ({
      ...item,
      count: 13
    }));
    res.render(`post`, {...article, categories});
  } else {
    res.render(`errors/404`, article);
  }
});

articlesRouter.post(`/:id/comments`, async (req, res) => {

  const response = await sendData(`/api/articles/${req.params.id}/comments`, req.body);
  if (response.statusCode === 404) {
    res.redirect(`errors/404`);
  } else {
    res.redirect(`/articles/${req.params.id}`);
  }
});

articlesRouter.post(`/add`, upload.single(`loadFile`), async (req, res) => {
  const article = req.body;
  const {file = {}} = req;

  const categoryList = Object.entries(article).reduce((categories, [key, value]) => {
    const [marker, index] = key.split(`-`);

    if (marker === `category`) {
      categories.push({
        id: index,
        name: value,
      });
    }
    return categories;
  }, []);

  const response = await sendData(`/api/articles`, {
    comments: [],
    title: article[`title`],
    announce: article[`announce`],
    category: categoryList,
    fullText: article[`fullText`],
    createdDate: article[`createdDate`] || dateFormat(new Date(), `%d.%m.%Y`),
    picture: file.filename,
  });

  if (response.statusCode === 400) {
    const {error: errors} = response;
    const allCategories = await getData(`/api/categories`);

    const categories = allCategories.map((item) => {
      return {
        ...item,
        checked: article[`categories`] ? article.categories.some((category) => (category.id === item.id)) : false,
      };
    });

    res.render(`new-post`, {isNavBurger: true, article, categories, errors: errors.message || {}});
  } else {
    res.redirect(`/my`);
  }
});

articlesRouter.post(`/edit/:id`, upload.single(`avatar`), async (req, res) => {
  const article = req.body;
  const {file} = req;

  const categoryList = Object.entries(article).reduce((categories, [key, value]) => {
    const [marker, index] = key.split(`-`);

    if (marker === `category`) {
      categories.push({
        id: index,
        name: value,
      });
    }
    return categories;
  }, []);

  const response = await putData(`/api/articles/${req.params.id}`, {
    comments: [],
    title: article[`title`],
    announce: article[`announce`],
    category: categoryList,
    fullText: article[`fullText`],
    createdDate: article[`createdDate`],
    picture: file,
  });

  if (response.statusCode === 400) {
    const errors = response.error.message || {};
    const allCategories = await getData(`/api/categories`);

    const categories = allCategories.map((item) => {
      return {
        ...item,
        checked: categoryList.some((category) => (category.id === item.id)),
      };
    });
    res.render(`new-post`, {isNavBurger: true, article, categories, errors});
  } else if (response.statusCode === 404) {
    res.redirect(`errors/404`);
  } else {
    res.redirect(`/my`);
  }
});

module.exports = articlesRouter;

