import { deleteWebhook } from "@/helpers/webhook/deleteWebhook";
import axios from "axios";

jest.mock("axios");

jest.mock("@/helpers/getAccessToken", () => ({
  getAccessToken: jest.fn().mockResolvedValue("fake_token"),
}));

jest.mock("prompt-sync", () => {
  return () => () => "123456";
});

describe("deleteWebhook helper", () => {
  const webhookid = 123456;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call the api with correct parameters and handle success", async () => {
    (axios.delete as jest.Mock).mockResolvedValueOnce({
      data: { success: true },
    });

    const result = await deleteWebhook();

    expect(axios.delete).toHaveBeenCalledWith(
      `https://api.igdb.com/v4/webhooks/${webhookid}`,
      expect.objectContaining({
        headers: expect.objectContaining({
          "Client-ID": expect.any(String),
          Authorization: "Bearer fake_token",
        }),
      })
    );
    expect(result).toEqual({ success: true });
  });

  it("should return an error object on failure", async () => {
    (axios.delete as jest.Mock).mockRejectedValueOnce(
      new Error("Request failed")
    );

    const result = await deleteWebhook();

    expect(result).toEqual({ error: "Failed to delete webhook" });
  });
});
