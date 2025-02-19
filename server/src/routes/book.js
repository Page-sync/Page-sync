const express = require("express");
const router = express.Router();
const { Readable } = require("stream");
const { strictLimiter } = require("../middleware/rateLimiter");
const {
  getGoogleBooks,
  getRandomBookSearchParam,
} = require("./helpers/bookUtils");
const GOOGLE_BOOKS_URL = process.env.GOOGLE_BOOKS_URL;
// cache
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 3600 });

// ---------- books ----------
router.get("/random", strictLimiter, async (req, res) => {
  const randomSearchParam = getRandomBookSearchParam(20);

  try {
    const result = await getGoogleBooks(randomSearchParam);
    if (result?.items) {
      const bookInfo = result.items
        .map((book) => {
          return {
            id: book.id,
            title: book.volumeInfo.title,
            authors: book.volumeInfo.authors || ["Unknown Author"],
            description:
              book.volumeInfo.description || "No description available",
            thumbnail: book.volumeInfo.imageLinks || null,
            publishedDate: book.volumeInfo.publishedDate,
            pageCount: book.volumeInfo.pageCount,
            categories: book.volumeInfo.categories || [],
            averageRating: book.volumeInfo.averageRating,
            ratingsCount: book.volumeInfo.ratingsCount,
            isbn:
              book.volumeInfo.industryIdentifiers?.find(
                (id) => id.type === "ISBN_13" || id.type === "ISBN_10"
              )?.identifier || null,
          };
        })
        .filter((book) => book.isbn !== null);
      console.log(bookInfo);
      return res.json(bookInfo);
    }
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error: error, message: "Get books error " });
  }
});
// get single pdf
router.get("/", strictLimiter, async (req, res) => {
  // 0573663203  test code
  try {
    const isbn = req.query.isbn;
    if (!isbn || isbn.trim() === "") {
      return res.status(400).json({
        message: "No isbn provided",
      });
    }
    // look up in cache
    const normalizedIsbn = isbn.trim();
    let downloadUrl = cache.get(normalizedIsbn);
    // make cache rally work
    console.log("first get cache", downloadUrl);
    if (!downloadUrl) {
      const url = `https://archive.org/advancedsearch.php?q=isbn:${isbn}&output=json`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch download url of PDF`, response);
      }
      const data = await response.json();
      if (!data.response.docs.length) {
        throw new Error(`No accessable url of PDF found`, response);
      }
      const identifier = data.response.docs[0].identifier;
      const pdfUrl = `https://archive.org/download/${identifier}/${identifier}.pdf`;
      cache.set(isbn, pdfUrl);
      downloadUrl = pdfUrl;
    }
    console.log(cache.get(normalizedIsbn));
    //get stream of pdf for display:
    const streamResponse = await fetch(downloadUrl);
    if (!streamResponse.ok) {
      console.error(streamResponse);
      throw new Error(`Failed to fetch PDF`);
    }
    const contentType =
      streamResponse.headers.get("content-type") || "application/pdf";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `inline; filename="${isbn}.pdf"`);
    const reader = streamResponse.body.getReader();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              break;
            }
            controller.enqueue(value);
          }
        } catch (error) {
          controller.error(error);
        }
      },
    });
    const nodeReadable = Readable.fromWeb(stream);
    nodeReadable.pipe(res);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error, message: "Get book PDF by isbn error " });
  }
});

// get single book's details
router.get("/info", async (req, res) => {
  try {
    const isbn = req.query.isbn;
    if (!isbn || isbn.trim() === "") {
      return res.status(400).json({
        message: "No isbn provided",
      });
    }
    const response = await fetch(`${GOOGLE_BOOKS_URL}?q=isbn:${isbn}`);
    const rawBook = await response.json();
    console.log(rawBook);
    if (!response || rawBook.items < 1) {
      throw new Error("No book found");
    }
    console.log(rawBook.items[0].volumeInfo);
    const bookInfo = {
      id: rawBook.items[0].id,
      title: rawBook.items[0].volumeInfo.title,
      authors: rawBook.items[0].volumeInfo.authors || ["Unknown Author"],
      description:
        rawBook.items[0].volumeInfo.description || "No description available",
      thumbnail: rawBook.items[0].volumeInfo.imageLinks || null,
      publishedDate: rawBook.items[0].volumeInfo.publishedDate,
      pageCount: rawBook.items[0].volumeInfo.pageCount,
      categories: rawBook.items[0].volumeInfo.categories || [],
      averageRating: rawBook.items[0].volumeInfo.averageRating,
      ratingsCount: rawBook.items[0].volumeInfo.ratingsCount,
      isbn:
        rawBook.items[0].volumeInfo.industryIdentifiers?.find(
          (id) => id.type === "ISBN_13" || id.type === "ISBN_10"
        )?.identifier || null,
    };
    console.log(bookInfo.thumbnail);
    return res.json(bookInfo);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error, message: "Get book info by isbn error " });
  }
});
module.exports = router;
