import mongoose from "mongoose";

const platform_logoSchema = new mongoose.Schema({
  checksum: {
    type: String,
    required: true,
  },
  height: {
    type: Number,
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
  },
  id: {
    type: Number,
    required: true,
    unique: true,
  },
});

const platform_logo =
  mongoose.models.platform_logo ||
  mongoose.model("platform_logo", platform_logoSchema);

export default platform_logo;
