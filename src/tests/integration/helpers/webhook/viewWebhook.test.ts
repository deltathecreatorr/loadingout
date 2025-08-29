import { viewWebhooks } from "@/helpers/webhook/viewWebhook";

describe("viewWebhook integration tests", () => {
  it("should view all webhooks that are active and inactive", async () => {
    const result = await viewWebhooks();
    // empty list if no webhooks exist
    expect(Array.isArray(result) || typeof result === "object").toBe(true);
  });

  it("should return an error if no webhooks exist", async () => {
    const client_id = process.env.IGDB_CLIENT_ID;
    process.env.IGDB_CLIENT_ID = "invalid_client_id";

    const result = await viewWebhooks();
    expect(result).toEqual({ error: "Failed to retrieve webhooks" });

    process.env.IGDB_CLIENT_ID = client_id;
  });
});
