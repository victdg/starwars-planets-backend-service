import { StarWarsPlanetService } from "../src/domain/StarWarsPlanetService";
import { BerryPort } from "../src/domain/ports/berryPort";
import { PlanetPort } from "../src/domain/ports/planetPort";
import { StarWarsCachePort } from "../src/domain/ports/starWarsCachePort";
import { ResponseHistoricalPort } from "../src/domain/ports/responseHistoricalPort";
import { KingPort } from "../src/domain/ports/kingPort";
import { Planet } from "../src/domain/models/planet";
import { Berry } from "../src/domain/models/berry";
import { NotFoundException } from "../src/domain/exceptions/notFoundException";
import { KingModel } from "../src/domain/models/king";
import { ResponseHistoricalModel } from "../src/domain/models/responseHistorical";
import { StarWarsPlanetModel } from "../src/domain/models/starWarsPlanetModel";
import { StarWarsPlanetPayloadModel } from "../src/domain/models/starWarsPlanetPayload";
import { FETCH_FROM_CACHE, SAVE_IN_CACHE } from "../src/utils/constants";

const mockBerryApiAdapter: jest.Mocked<BerryPort> = {
  fetchBerry: jest.fn(),
};

const mockPlanetApiAdapter: jest.Mocked<PlanetPort> = {
  fetchPlanet: jest.fn(),
};

const mockStarWarsCacheAdapter: jest.Mocked<StarWarsCachePort> = {
  fetch: jest.fn(),
  save: jest.fn(),
};

const mockResponseHistoricalAdapter: jest.Mocked<ResponseHistoricalPort> = {
  getHistoricalFetchPlanet: jest.fn(),
  save: jest.fn(),
};

const mockKingAdapter: jest.Mocked<KingPort> = {
  saveKing: jest.fn(),
};

describe("StarWarsPlanetService", () => {
  let service: StarWarsPlanetService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new StarWarsPlanetService(
      mockBerryApiAdapter,
      mockPlanetApiAdapter,
      mockStarWarsCacheAdapter,
      mockResponseHistoricalAdapter,
      mockKingAdapter
    );
  });

  describe("getPlanetWithBerry", () => {
    const planetId = 1;
    const mockPlanet: Planet = {
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
    const mockBerry: Berry = {
      id: 1,
      name: "cheri",
      growth_time: "3",
      size: 20,
      smoothness: "25",
    };
    const resultStarWarsPlanetPayload: StarWarsPlanetPayloadModel = {
      data: {
        id: planetId,
        name: mockPlanet.name,
        rotation_period: mockPlanet.rotation_period,
        orbital_period: mockPlanet.orbital_period,
        diameter: mockPlanet.diameter,
        climate: mockPlanet.climate,
        gravity: mockPlanet.gravity,
        terrain: mockPlanet.terrain,
        surface_water: mockPlanet.surface_water,
        population: mockPlanet.population,
        typicalFood: {
          name: mockBerry.name,
          growth_time: mockBerry.growth_time,
          smoothness: mockBerry.smoothness,
          size: mockBerry.size,
        },
      },
      cache: "data to fill",
    };

    const starWarsFromCache: StarWarsPlanetModel = {
      id: planetId,
      name: mockPlanet.name,
      rotation_period: mockPlanet.rotation_period,
      orbital_period: mockPlanet.orbital_period,
      diameter: mockPlanet.diameter,
      climate: mockPlanet.climate,
      gravity: mockPlanet.gravity,
      terrain: mockPlanet.terrain,
      surface_water: mockPlanet.surface_water,
      population: mockPlanet.population,
      typicalFood: {
        name: mockBerry.name,
        growth_time: mockBerry.growth_time,
        smoothness: mockBerry.smoothness,
        size: mockBerry.size,
      },
    };

    it("should return a planet from cache if it exists", async () => {
      const cachedPlanet: Planet = { ...mockPlanet };
      mockStarWarsCacheAdapter.fetch.mockResolvedValue(starWarsFromCache);

      const result = await service.fetchPlanet(planetId);
      resultStarWarsPlanetPayload.cache = FETCH_FROM_CACHE;

      expect(result).toEqual(resultStarWarsPlanetPayload);
      expect(mockStarWarsCacheAdapter.fetch).toHaveBeenCalledWith(planetId);
      expect(mockPlanetApiAdapter.fetchPlanet).not.toHaveBeenCalled();
      expect(mockBerryApiAdapter.fetchBerry).not.toHaveBeenCalled();
      expect(mockStarWarsCacheAdapter.save).not.toHaveBeenCalled();
      expect(mockResponseHistoricalAdapter.save).toHaveBeenCalled();
    });

    it("should fetch from APIs, combine, save to cache, and return the planet if not in cache", async () => {
      mockStarWarsCacheAdapter.fetch.mockResolvedValue(null);
      mockPlanetApiAdapter.fetchPlanet.mockResolvedValue(mockPlanet);
      mockBerryApiAdapter.fetchBerry.mockResolvedValue(mockBerry);

      const result = await service.fetchPlanet(planetId);
      resultStarWarsPlanetPayload.cache = SAVE_IN_CACHE;

      expect(result).toEqual(resultStarWarsPlanetPayload);
      expect(mockStarWarsCacheAdapter.fetch).toHaveBeenCalledWith(planetId);
      expect(mockPlanetApiAdapter.fetchPlanet).toHaveBeenCalledWith(planetId);
      expect(mockBerryApiAdapter.fetchBerry).toHaveBeenCalledWith(planetId);
      expect(mockStarWarsCacheAdapter.save).toHaveBeenCalled();
      expect(mockResponseHistoricalAdapter.save).toHaveBeenCalled();
    });

    it("should throw an exception if fetching the planet from API fails", async () => {
      mockStarWarsCacheAdapter.fetch.mockResolvedValue(null);
      const error = new NotFoundException("Planet not found");
      mockPlanetApiAdapter.fetchPlanet.mockRejectedValue(error);

      await expect(service.fetchPlanet(planetId)).rejects.toThrow(
        NotFoundException
      );
      expect(mockPlanetApiAdapter.fetchPlanet).toHaveBeenCalledWith(planetId);
      expect(mockBerryApiAdapter.fetchBerry).toHaveBeenCalled();
      expect(mockStarWarsCacheAdapter.save).not.toHaveBeenCalled();
      expect(mockResponseHistoricalAdapter.save).not.toHaveBeenCalled();
    });
  });

  describe("saveKing", () => {
    it("should call kingAdapter.save with the correct data", async () => {
      const king: KingModel = { planetId: 1, kingName: "Jabba" };
      mockKingAdapter.saveKing.mockResolvedValue();

      await service.saveKing(king);

      expect(mockKingAdapter.saveKing).toHaveBeenCalled();
      expect(mockKingAdapter.saveKing).toHaveBeenCalledTimes(1);
    });
  });

  describe("getHistoricalFetchPlanet", () => {
    it("should return historical data from the adapter", async () => {
      const mockHistoricalData: ResponseHistoricalModel[] = [
        { type: "planet", timestamp: "2024-01-01T12:00:00Z", response: "{}" },
      ];
      const mockHistoricalPaginatedData = {
        data: mockHistoricalData,
        lastKey: undefined,
      };
      mockResponseHistoricalAdapter.getHistoricalFetchPlanet.mockResolvedValue(
        mockHistoricalPaginatedData
      );

      const result = await service.getHistoricalFetchPlanet(undefined);

      expect(result).toEqual(mockHistoricalPaginatedData);
      expect(
        mockResponseHistoricalAdapter.getHistoricalFetchPlanet
      ).toHaveBeenCalledTimes(1);
    });
  });
});
