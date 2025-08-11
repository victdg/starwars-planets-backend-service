import { StarWarsPlanetModel } from "./models/starWarsPlanetModel";

export interface IStarWarsPlanet {
  fetchPlanet(id: number): Promise<StarWarsPlanetModel>;
}
