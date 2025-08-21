import mongoose from "mongoose";

// Creating the game Schema following the IGDB API structure from its Endpoint Structure
// https://api-docs.igdb.com/#game
/**
 * Schema for game data.
 */
const gameSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    age_ratings: [Number],
    aggregated_rating: Number,
    aggregated_rating_count: Number,
    alternative_names: [Number],
    artworks: [Number],
    bundles: [Number],
    category: Number,
    cover: {
      reference_id: Number,
      image_id: String,
    },
    created_at: Number,
    external_games: [Number],
    first_release_date: Number,
    game_engines: [Number],
    game_modes: [Number],
    genres: [Number],
    involved_companies: [Number],
    keywords: [Number],
    multiplayer_modes: [Number],
    name: { type: String, required: true },
    platforms: [Number],
    player_perspectives: [Number],
    rating: Number,
    rating_count: Number,
    release_dates: [Number],
    screenshots: [Number],
    similar_games: [Number],
    slug: String,
    storyline: String,
    summary: String,
    tags: [Number],
    themes: [Number],
    total_rating: Number,
    total_rating_count: Number,
    updated_at: Number,
    url: String,
    videos: [Number],
    websites: [Number],
    checksum: String,
    language_supports: [Number],
    collections: [Number],
    game_type: Number,
    cover_image_url: String,
    release_year: Number,
    popularity_score: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Virtual for formatted release date
gameSchema.virtual("release_date").get(function () {
  return this.first_release_date
    ? new Date(this.first_release_date * 1000)
    : null;
});

// Pre-save hook to process cover URL and extract year
gameSchema.pre("save", function (next) {
  if (this.cover?.url) {
    this.cover_image_url = this.cover.url.replace("t_thumb", "t_1080p");
  }

  if (this.first_release_date) {
    this.release_year = new Date(this.first_release_date * 1000).getFullYear();
  }

  next();
});

// Indexes for better performance
gameSchema.index({ name: "text", summary: "text" });
gameSchema.index({ rating: -1 });
gameSchema.index({ aggregated_rating: -1 });
gameSchema.index({ release_year: -1 });
gameSchema.index({ genres: 1 });
gameSchema.index({ platforms: 1 });

const Game = mongoose.models.Game || mongoose.model("Game", gameSchema);

export default Game;
