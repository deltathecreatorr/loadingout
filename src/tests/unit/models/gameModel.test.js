import Game from "@/models/gameModel.js";

describe("Game Model Unit Validation", () => {
  it("should accept a valid game model", async () => {
    const game = new Game({
      id: 1,
      name: "Test Game",
    });
    let err;
    try {
      await game.validate();
    } catch (error) {
      err = error;
    }
    expect(err).toBeUndefined();
  });

  it("should require a name", async () => {
    const game = new Game({
      id: 1,
      // name is missing
    });
    let err;
    try {
      await game.validate();
    } catch (error) {
      err = error;
    }
    expect(err.errors.name).toBeDefined();
  });

  it("should require a name", async () => {
    const game = new Game({
      name: "Test Game",
      // id is missing
    });
    let err;
    try {
      await game.validate();
    } catch (error) {
      err = error;
    }
    expect(err.errors.id).toBeDefined();
  });
});
