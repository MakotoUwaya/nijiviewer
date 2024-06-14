import _ from "lodash";

import { searchBooksByTitle } from "./catalog";

export const libraryData = {
  catalog: {
    booksByIsbn: {
      "978-1779501127": {
        isbn: "978-1779501127",
        title: "Watchmen",
        publicationYear: 1987,
        authorIds: ["alan-moore", "dave-gibbons"],
        bookItems: [
          {
            id: "book-item-1",
            libId: "nyc-central-lib",
            isLent: true,
          },
          {
            id: "book-item-2",
            libId: "nyc-central-lib",
            isLent: false,
          },
        ],
      },
    },
    authorsById: {
      "alan-moore": {
        name: "Alan Moore",
        bookIsbns: ["978-1779501127"],
      },
      "dave-gibbons": {
        name: "Dave Gibbons",
        bookIsbns: ["978-1779501127"],
      },
    },
  },
};

export const searchBooksByTitleJSON = (
  library: Record<string, unknown>,
  query: string
) => {
  const results = searchBooksByTitle(
    _.get(library, "catalog") as Record<string, unknown>,
    query
  );
  return JSON.stringify(results, null, 2);
};
