import { getAccessToken } from "@/helpers/getAccessToken";
import axios from "axios";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getAccessToken", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a valid access token", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { access_token: "mocked_token" },
    });

    const token = await getAccessToken();
    expect(token).toBe("mocked_token");
    expect(mockedAxios.post).toHaveBeenCalled();
  });

  it("should return an error on failure", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error("Request failed"));

    const result = await getAccessToken();
    expect(result).toEqual({ error: "Failed to authenticate with IGDB" });
    expect(mockedAxios.post).toHaveBeenCalled();
  });
});
