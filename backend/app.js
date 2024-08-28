const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { createSession } = require("./source/users/middlewares");
const connectDB = require("./_config/mongoConfig");

const userRoutes = require("./source/users/routes");
const postRoutes = require("./source/posts/routes");
const bookRoutes = require("./source/books/routes");
const recommendationRoutes = require("./source/recommendations/routes");

const swaggerDocs = require("./swagger");

const app = express();
const PORT = 3001;

connectDB().then((r) => console.log("MongoDB connected."));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use(createSession);

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/books", bookRoutes);

app.use("/docs", swaggerDocs.serve, swaggerDocs.setup);

console.log("--------------------");
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
