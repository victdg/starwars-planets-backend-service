import { PlanetHistoricalKeyModel } from "../../../application/models/planetHistoricalKey";
import { ResponseHistoricalModel } from "../../../application/models/responseHistorical";
import { ResponseHistoricalPaginatedModel } from "../../../application/models/responseHistoricalPaginated";
import { ResponseHistoricalPort } from "../../../application/ports/responseHistoricalPort";
import {
  HISTORICAL_TABLE_NAME,
  STAR_WARS_PLANET_HISTORICAL_TYPE,
} from "../../../utils/constants";
import { IDBClient } from "../IDBClient";

export class ResponseHistoricalAdapter implements ResponseHistoricalPort {
  constructor(private readonly dynamoClient: IDBClient) {}
  async getHistoricalFetchPlanet(
    lastKey: PlanetHistoricalKeyModel
  ): Promise<ResponseHistoricalPaginatedModel> {
    let partitionKey, lastSortKey;
    const paginatedData = await this.dynamoClient.queryPaginatedData<
      ResponseHistoricalModel,
      string,
      string
    >(
      HISTORICAL_TABLE_NAME,
      "type",
      STAR_WARS_PLANET_HISTORICAL_TYPE,
      "timestamp",
      lastSortKey
    );
    return {
      ...paginatedData,
      lastKey: paginatedData.lastKey
        ? ({
            partitionKey: paginatedData.lastKey.partitionKey,
            sortKey: paginatedData.lastKey.sortKey,
          } as PlanetHistoricalKeyModel)
        : undefined,
    };
  }
  async save(responseHistoricalModel: ResponseHistoricalModel): Promise<void> {
    await this.dynamoClient.saveItem(
      HISTORICAL_TABLE_NAME,
      responseHistoricalModel
    );
  }
}
