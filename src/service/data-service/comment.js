'use strict';

const {
  Comment,
} = require(`../models`);
const {dateFormat} = require(`../../utils`);

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

  async drop(commentId) {
    const deletedCommentsCount = await Comment.destroy({
      where: {commentId}
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
