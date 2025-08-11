import { StarWarsPlanet } from "../models/starWarsPlanet";

export interface StarWarsCachePort {
  fetch(id: number): Promise<StarWarsPlanet | null>;
  save(starWarsPlanet: StarWarsPlanet): Promise<void>;
}
