// import env variables
const dotenv = require("dotenv");
dotenv.config({ path: "../../.env.local" });
require("dotenv").config({ path: "./.env.local" });
const GOOGLE_BOOKS_KEY = process.env.GOOGLE_BOOKS_KEY;
const GOOGLE_BOOKS_URL = process.env.GOOGLE_BOOKS_URL;

//send get request helper: fetch google book
const getGoogleBooks = async (params) => {
  try {
    const url = new URL(`${GOOGLE_BOOKS_URL}`);
    url.searchParams.append("key", GOOGLE_BOOKS_KEY);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null) {
          url.searchParams.append(key, value.toString());
        }
      });
    }
    const urlString = url.toString();
    const response = await fetch(`${urlString}`);
    if (response.ok) {
      const books = await response.json();
      return books;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
//generate random book recommendation
const getRandomBookSearchParam = (count = 10) => {
  const searchTerms = [
    "adventure",
    "mystery",
    "science",
    "history",
    "fantasy",
    "biography",
    "art",
    "technology",
    "philosophy",
    "fiction",
    "poetry",
    "drama",
    "romance",
    "thriller",
    "psychology",
    "business",
  ];
  const randomTerm =
    searchTerms[Math.floor(Math.random() * searchTerms.length)];
  const startIndex = Math.floor(Math.random() * 100); // Google Books API max is 100
  const searchParams = {
    q: `${randomTerm}`,
    filter: "ebooks",
    maxResults: count,
    startIndex: startIndex,
    orderBy: "relevance", // Can be 'relevance' or 'newest'
    printType: "books",
  };
  return searchParams;
};

module.exports = {
  getGoogleBooks,
  getRandomBookSearchParam,
};
