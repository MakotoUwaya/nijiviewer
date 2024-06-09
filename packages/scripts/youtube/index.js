import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', override: true });

import _ from 'lodash';

import { watchmenBook } from './book.js';
import { catalogData } from './catalog.js';

const authorNames = (catalog, book) => {
  const authorIds = _.get(book, "authorIds");
  return _.map(authorIds, authorId => {
    return _.get(catalog, ["authorsById", authorId, "name"]);
  });
};

const bookInfo = (catalog, book) => {
  return {
    title: _.get(book, "title"),
    isbn: _.get(book, "isbn"),
    authorNames: authorNames(catalog, book),
  };
};


const main = async () => {
  console.log(bookInfo(catalogData, watchmenBook));
};

await main();
