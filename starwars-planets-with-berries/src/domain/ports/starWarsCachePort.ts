import { StarWarsPlanetModel } from "../models/starWarsPlanetModel";

export interface StarWarsCachePort {
  fetch(id: number): Promise<StarWarsPlanetModel | null>;
  save(starWarsPlanet: StarWarsPlanetModel): Promise<void>;
}
