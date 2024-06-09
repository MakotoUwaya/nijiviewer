import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', override: true });

import _ from 'lodash';

import { watchmenBook } from './book.js';
import { catalogData } from './catalog.js';

const main = async () => {
  console.log(_.get(catalogData, ["booksByIsbn", "978-1779501127", "title"]));
};

await main();
