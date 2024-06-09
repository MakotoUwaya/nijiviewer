import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', override: true });

import { libraryData, searchBooksByTitleJSON } from './library.js';

const main = async () => {
  console.log(searchBooksByTitleJSON(libraryData, "Watch"));
};

await main();
