import { KingModel } from "./models/king";
import { ResponseHistoricalPaginatedModel } from "./models/responseHistoricalPaginated";
import { StarWarsPlanetPayloadModel } from "./models/starWarsPlanetPayload";

export interface IStarWarsPlanet {
  fetchPlanet(id: number): Promise<StarWarsPlanetPayloadModel>;
  saveKing(king: KingModel): Promise<void>;
  getHistoricalFetchPlanet(
    lastKey: string
  ): Promise<ResponseHistoricalPaginatedModel>;
}
