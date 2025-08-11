import { Planet } from "../models/planet";

export interface PlanetPort {
  fetchPlanet(id: number): Promise<Planet>;
}
