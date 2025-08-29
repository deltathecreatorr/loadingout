import { connectWebhooks } from "@/helpers/webhook/connectWebhook";
import { AxiosResponse } from "axios";
import type { EntityType } from "@/helpers/webhook/connectWebhook";

describe("connectWebhook integration", () => {
  it("should successfully connect the webhooks for games", async () => {
    const result = await connectWebhooks("games");
    expect(Array.isArray(result)).toBe(true);

    if (Array.isArray(result)) {
      result.forEach((res) => {
        expect(
          (res as AxiosResponse).status === 200 || (res as any).error
        ).toBeTruthy();
      });
    }
  });

  it("should successfully connect the webhook for covers", async () => {
    const result = await connectWebhooks("covers");
    expect(Array.isArray(result)).toBe(true);

    if (Array.isArray(result)) {
      result.forEach((res) => {
        expect(
          (res as AxiosResponse).status === 200 || (res as any).error
        ).toBeTruthy();
      });
    }
  });

  it("should return an error if field is not games or covers", async () => {
    const result = await connectWebhooks("invalid" as unknown as EntityType);
    expect(result).toEqual([
      { error: "Failed to connect invalid webhook (create)" },
      { error: "Failed to connect invalid webhook (update)" },
      { error: "Failed to connect invalid webhook (delete)" },
    ]);
  });

  it("should return an error if required client_id are invalid", async () => {
    const client_id = process.env.IGDB_CLIENT_ID;
    delete process.env.IGDB_CLIENT_ID;

    const result = await connectWebhooks("covers");
    expect(result).toEqual({ error: "Failed to set up webhooks" });

    process.env.IGDB_CLIENT_ID = client_id;
  });

  it("should return an error if required host_url are invalid", async () => {
    const host_url = process.env.HOST_URL;
    delete process.env.HOST_URL;

    const result = await connectWebhooks("covers");
    expect(result).toEqual({ error: "Failed to set up webhooks" });

    process.env.HOST_URL = host_url;
  });
});
