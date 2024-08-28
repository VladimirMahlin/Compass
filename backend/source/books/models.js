const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  user_id: { type: Number, required: true },
  book_id: { type: Number, required: true },
});

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
