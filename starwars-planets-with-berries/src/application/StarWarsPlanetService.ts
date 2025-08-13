import {
  FETCH_FROM_CACHE,
  SAVE_IN_CACHE,
  STAR_WARS_PLANET_HISTORICAL_TYPE,
} from "../utils/constants";
import { IStarWarsPlanet } from "./IStarWarsPlanet";
import { Berry } from "./models/berry";
import { Planet } from "./models/planet";
import { ResponseHistoricalModel } from "./models/responseHistorical";
import { StarWarsPlanetModel } from "./models/starWarsPlanetModel";
import { StarWarsPlanetPayloadModel } from "./models/starWarsPlanetPayloadModel";
import { BerryPort } from "./ports/berryPort";
import { PlanetPort } from "./ports/planetPort";
import { ResponseHistoricalPort } from "./ports/responseHistoricalPort";
import { StarWarsCachePort } from "./ports/starWarsCachePort";

export class StarWarsPlanetService implements IStarWarsPlanet {
  constructor(
    private readonly berryAdapter: BerryPort,
    private readonly planetAdapter: PlanetPort,
    private readonly starWarsCacheAdapter: StarWarsCachePort,
    private readonly responseHistoricalAdapter: ResponseHistoricalPort
  ) {}

  async fetchPlanet(planetId: number): Promise<StarWarsPlanetPayloadModel> {
    let starWarsPlanetDataFromCache = await this.starWarsCacheAdapter.fetch(
      planetId
    );
    if (starWarsPlanetDataFromCache !== null) {
      const starWarsPlanetPayload: StarWarsPlanetPayloadModel = {
        data: starWarsPlanetDataFromCache,
        cache: FETCH_FROM_CACHE,
      };
      const historicalDataToSave = this.responseHistoricalDataCreate(
        starWarsPlanetPayload
      );
      this.responseHistoricalAdapter.save(historicalDataToSave);
      return starWarsPlanetPayload;
    }

    const [berry, planet] = await Promise.all([
      this.berryAdapter.fetchBerry(planetId),
      this.planetAdapter.fetchPlanet(planetId),
    ]);

    const starWarsPlanet = this.planetFromBerryAndPlanet(berry, planet);
    await this.starWarsCacheAdapter.save(starWarsPlanet);

    const starWarsPlanetPayload: StarWarsPlanetPayloadModel = {
      data: starWarsPlanet,
      cache: SAVE_IN_CACHE,
    };
    const historicalDataToSave = this.responseHistoricalDataCreate(
      starWarsPlanetPayload
    );
    this.responseHistoricalAdapter.save(historicalDataToSave);
    return starWarsPlanetPayload;
  }

  private planetFromBerryAndPlanet(
    berry: Berry,
    planet: Planet
  ): StarWarsPlanetModel {
    const starWarsPlanet: StarWarsPlanetModel = {
      id: berry.id,
      name: planet.name,
      rotation_period: planet.rotation_period,
      orbital_period: planet.orbital_period,
      diameter: planet.diameter,
      climate: planet.climate,
      gravity: planet.gravity,
      terrain: planet.terrain,
      surface_water: planet.surface_water,
      population: planet.population,
      typicalFood: {
        name: berry.name,
        growth_time: berry.growth_time,
        smoothness: berry.smoothness,
        size: berry.size,
      },
    };
    return starWarsPlanet;
  }

  private responseHistoricalDataCreate(
    dataToSave: StarWarsPlanetPayloadModel
  ): ResponseHistoricalModel {
    return {
      type: STAR_WARS_PLANET_HISTORICAL_TYPE,
      timestamp: new Date().toISOString(),
      response: dataToSave,
    };
  }
}
