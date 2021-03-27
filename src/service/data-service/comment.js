'use strict';

const {
  Comment,
} = require(`../models`);
const {dateFormat} = require(`../../utils`);
const {Op} = require(`sequelize`);

class CommentService {

  async create(articleId, comment) {
    const newComment = await Comment.create({
      text: comment.text,
      created: dateFormat(new Date(), `%Y-%m-%d %H:%M:%S`),
      userId: comment.userId,
      articleId,
    });
    return newComment.toJSON();
  }

  async drop(articleId, commentId) {
    const deletedCommentsCount = await Comment.destroy({
      where: {
        [Op.and]: [
          {
            id: commentId
          },
          {
            articleId
          }
        ]
      }
    });

    return !!deletedCommentsCount;
  }

  async findAll(article) {
    const comments = await Comment.findAll({
      where: {
        articleId: article
      },
      raw: true
    });
    return comments;
  }
}

module.exports = CommentService;
