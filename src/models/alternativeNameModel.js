import mongoose from "mongoose";

const alternative_nameSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  checksum: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
  },
  game: {
    required: true,
    type: Number,
  },
  name: {
    required: true,
    type: String,
  },
});

const alternative_name =
  mongoose.models.alternative_name ||
  mongoose.model("alternative_name", alternative_nameSchema);

export default alternative_name;
