require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { createSession } = require("./middlewares/session");
const connectDB = require("./_config/mongoConfig");
const errorHandler = require("./middlewares/errorHandler");

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const bookRoutes = require("./routes/bookRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");

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
app.use(errorHandler);

console.log("--------------------");
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
