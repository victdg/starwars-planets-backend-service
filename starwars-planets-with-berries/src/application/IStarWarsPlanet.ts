import { StarWarsPlanetPayloadModel } from "./models/starWarsPlanetPayloadModel";

export interface IStarWarsPlanet {
  fetchPlanet(id: number): Promise<StarWarsPlanetPayloadModel>;
}
