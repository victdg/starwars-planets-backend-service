import { PlanetApiAdapter } from "./planetApiAdapter";
import { IHttpClient } from "../IHttpClient";
import { PlanetDto } from "../dto/planet";
import { STAR_WARS_API_URL } from "../../../utils/constants";
import { NotFoundException } from "../../../domain/exceptions/notFoundException";

const mockHttpClient: jest.Mocked<IHttpClient> = {
  get: jest.fn(),
};

describe("PlanetApiAdapter", () => {
  let planetApiAdapter: PlanetApiAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    planetApiAdapter = new PlanetApiAdapter(mockHttpClient);
  });

  describe("fetchPlanet", () => {
    it("should call httpClient.get with the correct URL and return planet data on success", async () => {
      const planetId = 1;
      const expectedUrl = `${STAR_WARS_API_URL}${planetId}`;
      const mockPlanet: PlanetDto = {
        name: "Tatooine",
        rotation_period: "23",
        orbital_period: "304",
        diameter: "10465",
        climate: "arid",
        gravity: "1 standard",
        terrain: "desert",
        surface_water: "1",
        population: "200000",
      };

      mockHttpClient.get.mockResolvedValue(mockPlanet);

      const result = await planetApiAdapter.fetchPlanet(planetId);

      expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
      expect(mockHttpClient.get).toHaveBeenCalledWith(expectedUrl);
      expect(result).toEqual(mockPlanet);
    });

    it("should throw the same exception from httpClient when it fails", async () => {
      const planetId = 999;
      const expectedUrl = `${STAR_WARS_API_URL}${planetId}`;
      const errorMessage = "Planet not found";

      mockHttpClient.get.mockRejectedValue(new NotFoundException(errorMessage));

      await expect(planetApiAdapter.fetchPlanet(planetId)).rejects.toThrow(
        NotFoundException
      );
      await expect(planetApiAdapter.fetchPlanet(planetId)).rejects.toThrow(
        errorMessage
      );
      expect(mockHttpClient.get).toHaveBeenCalledWith(expectedUrl);
    });
  });
});
