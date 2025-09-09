import mongoose from "mongoose";

const genreSchema = new mongoose.Schema({
  checksum: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  url: {
    type: String,
  },
});

const genre = mongoose.models.genre || mongoose.model("genre", genreSchema);

export default genre;
