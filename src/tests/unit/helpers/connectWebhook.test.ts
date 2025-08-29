import axios from "axios";
import { AxiosResponse } from "axios";
import MockAdapter from "axios-mock-adapter";
import { connectWebhooks } from "@/helpers/webhook/connectWebhook";
import { getAccessToken } from "@/helpers/getAccessToken";

jest.mock("@/helpers/getAccessToken");

const mockedGetAccessToken = jest.mocked(getAccessToken);

describe("connectWebhooks", () => {
  let mock: MockAdapter;

  beforeAll(() => {
    process.env.IGDB_CLIENT_ID = "test-client-id";
    process.env.HOST_URL = "https://test-host.com";
    process.env.WEBHOOK_SECRET = "test-secret";
  });

  beforeEach(() => {
    mock = new MockAdapter(axios);
    mockedGetAccessToken.mockReset();
    mockedGetAccessToken.mockResolvedValue("test-access-token");
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
    jest.clearAllMocks();
  });

  describe("Expected Successful Behaviour", () => {
    it("should make successful connections to games webhook", async () => {
      mock.onPost("https://api.igdb.com/v4/games/webhooks").reply(200, {
        id: "webhook-1",
        url: "https://test-host.com/api/igdb/createWebhook",
        method: "create",
        status: "active",
      });
      const result = await connectWebhooks("games");

      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        expect(result).toHaveLength(3);
        expect((result[0] as AxiosResponse).status).toBe(200);
      }
    });

    it("should make successful connections to covers webhook", async () => {
      mock.onPost("https://api.igdb.com/v4/covers/webhooks").reply(200, {
        id: "webhook-2",
        url: "https://test-host.com/api/igdb/createWebhook",
        method: "create",
        status: "active",
      });
      const result = await connectWebhooks("covers");

      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        expect(result).toHaveLength(3);
      }
    });
  });

  describe("HTTP Validation", () => {
    it("should include correct headers in requests", async () => {
      mock.onPost("https://api.igdb.com/v4/games/webhooks").reply(200, {});

      await connectWebhooks("games");
      expect(mock.history.post.length).toBe(3);

      const request = mock.history.post[0];

      // Axios has a special object instead of a plain object, but it should still contain all of these headers
      const headers = { ...request.headers };

      expect(headers).toEqual({
        Accept: "application/json, text/plain, */*", //default header added to object by axios, is not added in original headers
        "Client-ID": "test-client-id",
        Authorization: "Bearer test-access-token",
        "Content-Type": "application/x-www-form-urlencoded",
      });
    });

    it("should include form data for each webhook method", async () => {
      mock.onPost("https://api.igdb.com/v4/games/webhooks").reply(200, {});

      await connectWebhooks("games");

      const requests = mock.history.post;
      const methods = requests.map((request) => {
        const data = new URLSearchParams(request.data);
        return data.get("method");
      });

      expect(methods).toEqual(["create", "update", "delete"]);
    });

    it("should call correct IGDB API endpoints", async () => {
      mock.onPost().reply(200, {});

      await connectWebhooks("games");
      expect(mock.history.post[0].url).toBe(
        "https://api.igdb.com/v4/games/webhooks"
      );

      await connectWebhooks("covers");
      expect(mock.history.post[3].url).toBe(
        "https://api.igdb.com/v4/covers/webhooks"
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle individual webhook connection failures", async () => {
      process.env.IGDB_CLIENT_ID = "test-client-id";
      process.env.HOST_URL = "https://test-host.com";
      process.env.WEBHOOK_SECRET = "test-secret";

      mockedGetAccessToken.mockResolvedValue("test-access-token");

      mock
        .onPost("https://api.igdb.com/v4/games/webhooks")
        .replyOnce(500, { error: "Internal Server Error" });
      mock
        .onPost("https://api.igdb.com/v4/games/webhooks")
        .replyOnce(200, { success: true });
      mock
        .onPost("https://api.igdb.com/v4/games/webhooks")
        .replyOnce(200, { success: true });

      const result = await connectWebhooks("games");

      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        expect(result).toHaveLength(3);

        expect(result[0]).toEqual({
          error: "Failed to connect games webhook (create)",
        });

        expect((result[1] as AxiosResponse).status).toBe(200);
        expect((result[1] as AxiosResponse).data).toEqual({ success: true });

        expect((result[2] as AxiosResponse).status).toBe(200);
        expect((result[2] as AxiosResponse).data).toEqual({ success: true });
      }
    });

    it("should handle getAccessToken failure", async () => {
      mockedGetAccessToken.mockRejectedValue(
        new Error("Failed to get access token")
      );

      const result = await connectWebhooks("games");

      expect(result).toEqual({ error: "Failed to set up webhooks" });
    });

    it("should handle empty environment variables", async () => {
      delete process.env.IGDB_CLIENT_ID;
      delete process.env.HOST_URL;
      delete process.env.WEBHOOK_SECRET;

      const result = await connectWebhooks("games");

      expect(result).toEqual({
        error: "Failed to set up webhooks",
      });
    });
  });
});
