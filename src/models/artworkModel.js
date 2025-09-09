import mongoose from "mongoose";

const artworkSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  game: {
    required: true,
    type: Number,
  },
  image_id: {
    required: true,
    type: String,
  },
  url: {
    required: true,
    type: String,
  },
  width: {
    required: true,
    type: Number,
  },
  height: {
    required: true,
    type: Number,
  },
  checksum: {
    required: true,
    type: String,
  },
});

const artwork =
  mongoose.models.artwork || mongoose.model("artwork", artworkSchema);

export default artwork;
