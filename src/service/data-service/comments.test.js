'use strict';

const {getRandomInt} = require(`../../utils`);
const getMockData = require(`../lib/get-mock-data`);

const {
  CommentService,
  ArticleService,
} = require(`./`);

let mockData;
let articleService;
let commentService;

beforeEach(async () => {
  mockData = await getMockData();
  articleService = new ArticleService(mockData);
  commentService = new CommentService();
});


describe(`Methods data-services: CommentService`, () => {
  test(`findAll`, () => {
    const article = mockData[getRandomInt(0, mockData.length - 1)];

    expect(commentService.findAll(article)).toStrictEqual(article.comments);
  });

  test(`create`, () => {
    const article = mockData[getRandomInt(0, mockData.length - 1)];
    const newComment = {text: `Совсем немного... А сколько игр в комплекте?`};
    const comment = commentService.create(article, newComment);

    expect(comment).toStrictEqual({...newComment, id: comment.id});
  });

  test(`drop`, () => {
    const article = mockData[0];
    const commentId = mockData[0].comments[0].id;
    const comment = commentService.drop(article, commentId);

    expect((commentService.findAll(article)).find((item) => item.id === comment.id)).toEqual(undefined);
    expect(commentService.drop(article, commentId)).toEqual(null);
  });
});
