const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong on the server.";

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message, errors: err.errors });
  }

  if (err.code === 11000) {
    return res
      .status(409)
      .json({
        message: "Duplicate key error: A record with this key already exists.",
      });
  }

  if (err.sqlMessage) {
    return res
      .status(500)
      .json({ message: "Database operation failed.", error: err.sqlMessage });
  }

  res.status(statusCode).json({ message: message });
};

module.exports = errorHandler;
