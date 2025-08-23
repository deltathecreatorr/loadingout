import Game from "@/models/gameModel";
import Cover from "@/models/coverModel";

export const createTestGame = async (overrides = {}) => {
  const game = new Game({
    id: 23456,
    name: "Test Game",
    aggregated_Rating: 85,
    rating_count: 100,
    first_release_date: new Date(),
    cover: 12345,
    ...overrides,
  });
  await game.save();
  return game;
};

export const createTestCover = async (overrides = {}) => {
  const cover = new Cover({
    id: 12345,
    game: 23456,
    image_id: "test_image_id",
    url: "https://images.igdb.com/igdb/image/upload/t_thumb/test_image_id.jpg",
    width: 600,
    height: 800,
    checksum: "test_checksum",
    ...overrides,
  });
  await cover.save();
  return cover;
};
