import mongoose from "mongoose";
/**
 * This schema defines the structure of the cover image documents
 * stored in the MongoDB database.
 */
const coverSchema = new mongoose.Schema({
  alpha_channel: {
    type: Boolean,
    default: false,
  },
  animated: {
    type: Boolean,
    default: false,
  },
  checksum: {
    type: String, // UUID format
    required: true,
  },
  game: {
    type: Number,
    default: null,
  },
  game_localization: {
    type: Number,
    default: null,
  },
  height: {
    type: Number,
    required: true,
  },
  id: {
    type: Number,
    unique: true,
    required: true,
  },
  image_id: {
    type: String,
    unique: true,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
});

const Cover = mongoose.models.Cover || mongoose.model("Cover", coverSchema);

export default Cover;
