import Cover from "@/models/coverModel.js";

describe("Cover Model Unit Validation", () => {
  it("should require image_id", async () => {
    const cover = new Cover({
      id: 1, //image_id is missing
      url: "https://valid.url/cover.jpg",
      checksum: "valid_checksum",
      height: 600,
      width: 800,
    });
    let err;
    try {
      await cover.validate();
    } catch (error) {
      err = error;
    }
    expect(err.errors.image_id).toBeDefined();
  });

  it("should require a url", async () => {
    const cover = new Cover({
      id: 1,
      image_id: "valid_image_id", // url missing
      checksum: "valid_checksum",
      height: 600,
      width: 800,
    });
    let err;
    try {
      await cover.validate();
    } catch (error) {
      err = error;
    }
    expect(err.errors.url).toBeDefined();
  });

  it("should require a checksum", async () => {
    const cover = new Cover({
      id: 1,
      image_id: "valid_image_id", // url missing
      url: "https://valid.url/cover.jpg",
      height: 600,
      width: 800,
    });
    let err;
    try {
      await cover.validate();
    } catch (error) {
      err = error;
    }
    expect(err.errors.checksum).toBeDefined();
  });

  it("should require a height", async () => {
    const cover = new Cover({
      id: 1,
      image_id: "valid_image_id", // url missing
      checksum: "valid_checksum",
      url: "https://valid.url/cover.jpg",
      width: 800,
    });
    let err;
    try {
      await cover.validate();
    } catch (error) {
      err = error;
    }
    expect(err.errors.height).toBeDefined();
  });

  it("should require a width", async () => {
    const cover = new Cover({
      id: 1,
      image_id: "valid_image_id", // url missing
      checksum: "valid_checksum",
      url: "https://valid.url/cover.jpg",
      height: 600,
    });
    let err;
    try {
      await cover.validate();
    } catch (error) {
      err = error;
    }
    expect(err.errors.width).toBeDefined();
  });

  it("should create a cover with valid data", async () => {
    const cover = new Cover({
      id: 1,
      image_id: "valid_image_id",
      url: "https://valid.url/cover.jpg",
      checksum: "valid_checksum",
      height: 600,
      width: 800,
    });
    let err;
    try {
      await cover.validate();
    } catch (error) {
      err = error;
    }
    expect(err).toBeUndefined();
  });
});
