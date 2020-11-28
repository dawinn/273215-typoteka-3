'use strict';
const {Router} = require(`express`);
const articlesRouter = new Router();
const {getData, sendData} = require(`../request`);

articlesRouter.get(`/add`, async (req, res) => {
  const allCategories = await getData(`/api/categories`);

  const categories = allCategories.map((item) => {
    return {
      ...item,
      checked: false,
    };
  });
  res.render(`new-post`, {isNavBurger: true, article: {}, categories});
});
articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const article = await getData(`/api/articles/${req.params.id}`);
  const allCategories = await getData(`/api/categories`);

  const categories = allCategories.map((item) => {
    return {
      item,
      checked: article.category.includes(item),
    };
  });
  res.render(`new-post`, {isNavBurger: true, article, categories});
});

articlesRouter.get(`/:id`, async (req, res) => {

  res.render(`post`, {});
});

articlesRouter.post(`/add`, async (req, res) => {
  const article = req.body;

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
    createdDate: article[`createdDate`],
    picture: article[`picture`]
  });

  if (response) {
    res.redirect(`/my`);
  } else {
    const allCategories = await getData(`/api/categories`);

    const categories = allCategories.map((item) => {
      return {
        item,
        checked: article[`category`].includes(item),
      };
    });
    res.render(`new-post`, {isNavBurger: true, article, categories});
  }
});

module.exports = articlesRouter;

