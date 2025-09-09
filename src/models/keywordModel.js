import mongoose from "mongoose";

const keywordSchema = new mongoose.Schema({
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

const keyword =
  mongoose.models.keyword || mongoose.model("keyword", keywordSchema);

export default keyword;
