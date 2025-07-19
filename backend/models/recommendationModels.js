const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema({
  user_id: { type: Number, required: true },
  input_book_ids: { type: [Number], required: true },
  output_book_ids: { type: [Number], required: true },
  input_sub_genre: { type: String },
  created_at: { type: Date, default: Date.now },
});

const Recommendation = mongoose.model("Recommendation", recommendationSchema);

module.exports = Recommendation;
