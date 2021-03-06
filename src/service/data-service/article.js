'use strict';
const logger = require(`../lib/logger`);
const {dateFormat} = require(`../../utils`);
const paginate = require(`../lib/paginator`);

const {Op} = require(`sequelize`);
const {
  Category,
  Comment,
  Article,
  Picture,
} = require(`../models`);

const articleOptions = {
  include: [
    {
      model: Comment,
      as: `comments`
    },
    {
      model: Picture,
      as: `picture`
    }]
};

class ArticleService {

  async create(article) {
    try {
      const picture = await createPicture({
        /* с веба приходит только строка с именем файла */
        image: article.picture,
        image2x: article.picture,
        background: `2`,
      });

      const newArticle = await Article.create({
        title: article.title,
        announce: article.announce,
        fullText: article.fullText,
        createDate: dateFormat(new Date(), `%Y-%m-%d`),
        updated: dateFormat(new Date(), `%Y-%m-%d`),
        pictureId: picture.id,
      }, {
        include: [{
          association: Article.Picture,
        }]
      });

      const categories = await Category.findAll({
        where: {
          name: {
            [Op.in]: article.category.map((item) => item.name)
          }
        }
      });
      await newArticle.addCategories(categories);
      return newArticle.toJSON();

    } catch (error) {
      logger.error(`Error when creating article ${error}`);
      return {};
    }
  }

  async drop(id) {
    const deletedArticlesCount = await Article.destroy({
      where: {id},
      cascade: true,
    });

    return !!deletedArticlesCount;
  }

  async findAll(options) {
    const {page, limit, ...otherOptions} = options;
    const {data: articles, ...result} = await paginate(Article, {...articleOptions, ...otherOptions}, page, limit);
    if (!articles) {
      return [];
    }

    const list = await Promise.all(articles.map(async (article) => {
      const category = await getCategoriesList(article);
      return {
        ...article.toJSON(),
        category,
      };
    }));

    return {
      ...result,
      articles: list,
    };
  }

  async findOne(id) {
    const article = await Article.findByPk(id, articleOptions);

    if (!article) {
      return null;
    }

    const categories = await article.getCategories({raw: true});
    // const category = await getCategoriesList(article);
    return {
      ...article.toJSON(),
      categories,
    };
  }

  async update(id, article) {
    try {
      const updateArticle = await Article.findByPk(id);

      if (article.picture) {
        /* загрузили новую картинку */
        updateArticle.pictureId = await createPicture(article.picture);
      }

      updateArticle.title = article.title;
      updateArticle.announce = article.announce;
      updateArticle.fullText = article.fullText;
      updateArticle.updated = dateFormat(new Date(), `%Y-%m-%d %H:%M:%S`);

      return await updateArticle.save();
    } catch (error) {
      logger.error(`Error when creating article ${error}`);
      return false;
    }
  }

}
/* дополнительные функции */
async function createPicture(picture) {
  const newObject = await Picture.create({
    image: picture.image,
    image2x: picture.image2x,
    background: picture.background,
  }, {raw: true});
  return newObject.toJSON();
}

async function getCategoriesList(article) {
  try {
    const categories = await article.getCategories({raw: true});
    return categories.reduce((categoryList, category) => {
      categoryList.push(category.name);
      return categoryList;
    }, []);
  } catch (error) {
    logger.error(`Error when creating article ${error}`);
    return {};
  }
}

module.exports = ArticleService;
