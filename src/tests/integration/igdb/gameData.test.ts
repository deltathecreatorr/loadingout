import { POST } from "@/app/api/igdb/gameData/route";
import { createTestCover, createTestGame } from "@/tests/testUtilities";
import { NextRequest } from "next/server";

describe("Normal Expected Cases", () => {
  it("should return an empty array when no games exist", async () => {
    const request = new NextRequest("http://localhost:3000/api/igdb/gameData", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.games).toEqual([]);
    expect(data.covers).toEqual([]);
  });

  it("should return games and covers", async () => {
    await createTestCover();
    await createTestGame();
    const request = new NextRequest("http://localhost:3000/api/igdb/gameData", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.games).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
        }),
      ])
    );
    expect(data.covers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          url: expect.any(String),
          checksum: expect.any(String),
        }),
      ])
    );
  });
});

describe("Filter Cases", () => {
  it("should filter games by aggregated_rating", async () => {
    await createTestGame({ aggregated_rating: 95 });
    await createTestCover();
    const request = new NextRequest("http://localhost:3000/api/igdb/gameData", {
      method: "POST",
      body: JSON.stringify({
        filters: {
          aggregated_rating: { $gte: 95 },
        },
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.games).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
        }),
      ])
    );
    expect(data.games[0].aggregated_rating).toBe(95);
  });
});

describe("Sorting Cases", () => {
  it("should sort games by aggregated rating", async () => {
    await createTestGame({ id: 1, aggregated_rating: 95 });
    await createTestGame({ id: 2, aggregated_rating: 90 });
    await createTestGame({ id: 3, aggregated_rating: 85 });
    const request = new NextRequest("http://localhost:3000/api/igdb/gameData", {
      method: "POST",
      body: JSON.stringify({
        sort: {
          aggregated_rating: "desc",
        },
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.games).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
        }),
      ])
    );
    expect(data.games[0].aggregated_rating).toBe(95);
    expect(data.games[1].aggregated_rating).toBe(90);
    expect(data.games[2].aggregated_rating).toBe(85);
  });
});

describe("Pagination Cases", () => {
  it("should limit the number of games returned", async () => {
    await createTestGame({ id: 1 });
    await createTestGame({ id: 2 });
    await createTestGame({ id: 3 });
    const request = new NextRequest("http://localhost:3000/api/igdb/gameData", {
      method: "POST",
      body: JSON.stringify({
        limit: 2,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.games).toHaveLength(2);
  });

  it("should skip the correct number of games", async () => {
    await createTestGame({ id: 1 });
    await createTestGame({ id: 2 });
    await createTestGame({ id: 3 });
    const request = new NextRequest("http://localhost:3000/api/igdb/gameData", {
      method: "POST",
      body: JSON.stringify({
        //skipped the first game, so it returns id 2 and 3
        skip: 1,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.games).toHaveLength(2);
    expect(data.games[0].id).toBe(2);
    expect(data.games[1].id).toBe(3);
  });
});

describe("Cover cases", () => {
  it("should handle games with no covers by skipping that game's covers and system will use a default", async () => {
    await createTestGame({ id: 1 });
    await createTestGame({ id: 2 });
    await createTestCover({ game: 2, id: 6, image_id: "test_image_1" });
    await createTestGame({ id: 3 });
    await createTestCover({ game: 3, id: 7, image_id: "test_image_2" });
    const request = new NextRequest("http://localhost:3000/api/igdb/gameData", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.games).toHaveLength(3);
    expect(data.covers).toHaveLength(2);
    expect(data.covers[0].game).toBe(2);
    expect(data.covers[1].game).toBe(3);
  });
});

describe("Error Cases", () => {
  it("should return 400 when request is invalid", async () => {
    const request = new NextRequest("http://localhost:3000/api/igdb/gameData", {
      method: "POST",
      body: "invalid body",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it("should handle database errors", async () => {
    const request = new NextRequest("http://localhost:3000/api/igdb/gameData", {
      method: "POST",
      body: JSON.stringify({
        filters: { invalid_operation: true },
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("should handle sorting errors", async () => {
    const request = new NextRequest("http://localhost:3000/api/igdb/gameData", {
      method: "POST",
      body: JSON.stringify({
        sort: { invalid_field: "desc" },
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
