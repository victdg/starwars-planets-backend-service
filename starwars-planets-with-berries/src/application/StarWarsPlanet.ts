import { IStarWarsPlanet } from "./IStarWarsPlanet";
import { Berry } from "./models/Berry";
import { Planet } from "./models/planet";
import { StarWarsPlanetModel } from "./models/starWarsPlanetModel";
import { BerryPort } from "./ports/berryPort";
import { PlanetPort } from "./ports/planetPort";
import { StarWarsCachePort } from "./ports/starWarsCachePort";

export class StarWarsPlanet implements IStarWarsPlanet {
  constructor(
    private readonly berryAdapter: BerryPort,
    private readonly planetAdapter: PlanetPort,
    private readonly starWarsCacheAdapter: StarWarsCachePort
  ) {
    this.berryAdapter = berryAdapter;
    this.planetAdapter = planetAdapter;
    this.starWarsCacheAdapter = starWarsCacheAdapter;
  }

  async fetchPlanet(planetId: number): Promise<StarWarsPlanetModel> {
    let starWarsPlanetDataFromCache = await this.starWarsCacheAdapter.fetch(
      planetId
    );
    if (starWarsPlanetDataFromCache !== null) {
      return starWarsPlanetDataFromCache;
    }

    const [berry, planet] = await Promise.all([
      this.berryAdapter.fetchBerry(planetId),
      this.planetAdapter.fetchPlanet(planetId),
    ]);

    const starWarsPlanet = this.planetFromBerryAndPlanet(berry, planet);
    await this.starWarsCacheAdapter.save(starWarsPlanet);
    return starWarsPlanet;
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
        name: berry.item.name,
        size: berry.size,
      },
    };
    return starWarsPlanet;
  }
}
