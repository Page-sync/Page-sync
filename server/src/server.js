require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const SESSION_SECRET = process.env.SESSION_SECRET;
const PORT = process.env.PORT;
const app = express();

// ---------- middleware ----------

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
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

// routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/api/book", require("./routes/book"));
app.use("/api/note", require("./routes/note"));
app.use("/api/user", require("./routes/user"));

app.get("/api", (req, res) => {
  res.send({ message: "connected" }).status(200);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
