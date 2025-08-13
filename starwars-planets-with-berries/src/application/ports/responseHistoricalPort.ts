import { PlanetHistoricalKeyModel } from "../models/planetHistoricalKey";
import { ResponseHistoricalModel } from "../models/responseHistorical";
import { ResponseHistoricalPaginatedModel } from "../models/responseHistoricalPaginated";

export interface ResponseHistoricalPort {
  save(responseHistoricalModel: ResponseHistoricalModel): Promise<void>;
  getHistoricalFetchPlanet(
    lastKey: PlanetHistoricalKeyModel
  ): Promise<ResponseHistoricalPaginatedModel>;
}
