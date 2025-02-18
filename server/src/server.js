const dotenv = require("dotenv");
const express = require("express");
const rateLimit = require("express-rate-limit");
const NodeCache = require("node-cache");
const session = require("express-session");
const cors = require("cors");

// cache queried single book url for 1 hour
const cache = new NodeCache({ stdTTL: 3600 });
// import helpers:
const {
  getGoogleBooks,
  getRandomBookSearchParam,
} = require("./helpers/apiCall");
//TODO:  Firebase
dotenv.config();
const app = express();
const PORT = process.env.PORT;

// selective limit rate for endpoints that query outer api
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: "Too many requests from this IP. Try again later",
});

app.use(
  cors({
    origin: [
      //   "https://frontend- Projet name .onrender.com",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:4173",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

// app
//   .use(
//     session({
//       secret: process.env.SESSION_SECRET,
//       // name: "sessionId",
//       resave: false,
//       saveUninitialized: false,
//       // rolling: true,
//       cookie: {
//         // sameSite: "none",
//         maxAge: 3 * 24 * 60 * 60 * 1000,
//         secure: process.env.NODE_ENV === "production",
//         httpOnly: true,
//         sameSite: "strict",
//       },
//     })
//   );

app.use(express.json());

app.get("/api", (req, res) => {
  res.send({ message: "connected" }).status(200);
});

app.get("/api/book/random", strictLimiter, async (req, res) => {
  const randomSearchParam = getRandomBookSearchParam();

  try {
    const result = await getGoogleBooks(randomSearchParam);
    if (result?.items) {
      const bookInfo = result.items.map((book) => {
        return {
          id: book.id,
          title: book.volumeInfo.title,
          authors: book.volumeInfo.authors || ["Unknown Author"],
          description:
            book.volumeInfo.description || "No description available",
          thumbnail: book.volumeInfo.imageLinks?.thumbnail || null,
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
      });
      return res.json({ bookArray: bookInfo }).status(200);
    }
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error: error, message: "Get books error " });
  }
});
app.get("/api/book", strictLimiter, async (req, res) => {
  // 0573663203  test code
  try {
    const isbn = req.query.isbn;
    // look up in cache
    const cachedUrl = cache.get(isbn);
    if (cachedUrl) {
      return res.status(200).json({ url: cachedUrl });
    }
    const url = `https://archive.org/advancedsearch.php?q=isbn:${isbn}&output=json`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(404).json({
        error: error,
        message: "Could not fetch data from Internet Archive",
      });
    }
    const data = await response.json();
    if (!data.response.docs.length) {
      return res.status(404).json({
        message: "Could not find PDF by isbn in Internet Archive",
      });
    }
    const identifier = data.response.docs[0].identifier;
    const pdfUrl = `https://archive.org/download/${identifier}/${identifier}.pdf`;
    cache.set(isbn, pdfUrl);
    return res.json({ url: pdfUrl }).status(200);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error, message: "Get book by isbn error " });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
