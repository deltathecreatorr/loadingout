import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    igdbID: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    summary: String,
    rating: Number,
    popularity: Number,
    cover: {
      url: String,
    },
  },
  { timestamps: true }
);

const Game = mongoose.models.Game || mongoose.model("Game", gameSchema);

export default Game;
