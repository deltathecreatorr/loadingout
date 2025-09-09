import mongoose from "mongoose";

const screenshotSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  checksum: {
    type: String,
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
  height: {
    type: Number,
    required: true,
  },
});
const screenshot =
  mongoose.models.screenshot || mongoose.model("screenshot", screenshotSchema);

export default screenshot;
