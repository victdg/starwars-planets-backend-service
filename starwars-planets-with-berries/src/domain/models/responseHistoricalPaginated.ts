import { PlanetHistoricalKeyModel } from "./planetHistoricalKey";
import { ResponseHistoricalModel } from "./responseHistorical";

export interface ResponseHistoricalPaginatedModel {
  data: Array<ResponseHistoricalModel>;
  lastKey?: string | PlanetHistoricalKeyModel;
}
