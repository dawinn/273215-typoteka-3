'use strict';
const logger = require(`../lib/logger`);
const {PageSettings} = require(`../../constants`);

const paginate = async (model, options, pageNumber, pageLimit, transform) => {
  try {
    const limit = parseInt(pageLimit, 10) || PageSettings.MAX_ELEMENT;
    const page = parseInt(pageNumber, 10) || PageSettings.DEFAULT;

    let {count, rows} = await model.findAndCountAll({...options, offset: getOffset(page, limit), limit, distinct: true});

    if (transform && typeof transform === `function`) {
      rows = transform(rows);
    }

    return {
      previousPage: getPreviousPage(page),
      currentPage: page,
      nextPage: getNextPage(page, limit, count),
      total: count,
      pageList: getPageIndexList(page, PageSettings.LIMIT_PAGINATE, Math.ceil(count / limit)),
      limit,
      data: rows
    };
  } catch (error) {
    logger.error(error);
    return {};
  }
};

const getOffset = (page, limit) => {
  return (page * limit) - limit;
};

const getNextPage = (page, limit, total) => {
  if ((total / limit) > page) {
    return page + 1;
  }

  return null;
};

const getPreviousPage = (page) => {
  if (page <= 1) {
    return null;
  }
  return page - 1;
};

const getPageIndexList = (currentPage, countPage, totalPage) => {
  currentPage = currentPage < 1 ? 1 : currentPage;
  let indexList = [currentPage];
  let remain = currentPage > totalPage ? currentPage : totalPage;
  remain = (countPage <= remain ? countPage : remain) - 1;
  for (let i = 1; remain > 0; i++) {
    if (currentPage + i <= totalPage) {
      indexList.push(currentPage + i);
      remain--;
    }
    if (currentPage - i >= 1) {
      indexList.unshift(currentPage - i);
      remain--;
    }
  }
  return indexList;
};

module.exports = paginate;
