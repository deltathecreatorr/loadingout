import mongoose from "mongoose";

const company_logosSchema = new mongoose.Schema({
  checksum: {
    type: String,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  image_id: {
    type: String,
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
  id: {
    type: Number,
    required: true,
    unique: true,
  },
});

const company_logos =
  mongoose.models.company_logos ||
  mongoose.model("company_logos", company_logosSchema);

export default company_logos;
