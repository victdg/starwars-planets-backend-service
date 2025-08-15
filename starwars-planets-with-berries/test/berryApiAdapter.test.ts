import { BerryApiAdapter } from "../src/infrastructure/gateway/adapter/berryApiAdapter";
import { IHttpClient } from "../src/infrastructure/gateway/IHttpClient";
import { BerryDto } from "../src/infrastructure/gateway/dto/berry";
import { BERRY_API_URL } from "../src/utils/constants";
import { NotFoundException } from "../src/domain/exceptions/notFoundException";

const mockHttpClient: jest.Mocked<IHttpClient> = {
  get: jest.fn(),
};

describe("BerryApiAdapter", () => {
  let berryApiAdapter: BerryApiAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    berryApiAdapter = new BerryApiAdapter(mockHttpClient);
  });

  describe("fetchBerry", () => {
    it("should call httpClient.get with the correct URL and return berry data on success", async () => {
      const berryId = 1;
      const expectedUrl = `${BERRY_API_URL}${berryId}`;
      const mockBerry: BerryDto = {
        id: 1,
        name: "cheri",
        growth_time: "3",
        size: 20,
        smoothness: "25",
      };

      mockHttpClient.get.mockResolvedValue(mockBerry);

      const result = await berryApiAdapter.fetchBerry(berryId);

      expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
      expect(mockHttpClient.get).toHaveBeenCalledWith(expectedUrl);
      expect(result).toEqual(mockBerry);
    });

    it("should throw the same exception from httpClient when it fails", async () => {
      const berryId = 999;
      const expectedUrl = `${BERRY_API_URL}${berryId}`;
      const errorMessage = "Berry not found";

      mockHttpClient.get.mockRejectedValue(new NotFoundException(errorMessage));

      await expect(berryApiAdapter.fetchBerry(berryId)).rejects.toThrow(
        NotFoundException
      );
      await expect(berryApiAdapter.fetchBerry(berryId)).rejects.toThrow(
        errorMessage
      );
      expect(mockHttpClient.get).toHaveBeenCalledWith(expectedUrl);
    });
  });
});
