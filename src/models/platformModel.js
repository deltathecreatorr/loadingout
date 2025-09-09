import mongoose from "mongoose";

const platformSchema = new mongoose.Schema({
  abbreviation: {
    type: String,
  },
  checksum: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  url: {
    type: String,
  },
  summary: {
    type: String,
  },
  platform_logo: {
    type: Number,
  },
});

const platform =
  mongoose.models.platform || mongoose.model("platform", platformSchema);

export default platform;
