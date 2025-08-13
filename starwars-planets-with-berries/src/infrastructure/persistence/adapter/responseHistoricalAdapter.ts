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
    lastSortKey?: string
  ): Promise<ResponseHistoricalPaginatedModel> {
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

    const { data, lastKey } = paginatedData;

    return {
      data: data,
      lastKey: { type: lastKey?.type, timestamp: lastKey?.timestamp },
    };
  }

  async save(responseHistoricalModel: ResponseHistoricalModel): Promise<void> {
    await this.dynamoClient.saveItem(
      HISTORICAL_TABLE_NAME,
      responseHistoricalModel
    );
  }
}
