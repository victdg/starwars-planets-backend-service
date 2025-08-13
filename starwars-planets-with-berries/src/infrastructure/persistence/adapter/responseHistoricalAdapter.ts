import { ResponseHistoricalModel } from "../../../application/models/responseHistorical";
import { ResponseHistoricalPort } from "../../../application/ports/responseHistoricalPort";
import { HISTORICAL_TABLE_NAME } from "../../../utils/constants";
import { IDBClient } from "../IDBClient";

export class ResponseHistoricalAdapter implements ResponseHistoricalPort {
  constructor(private readonly dynamoClient: IDBClient) {}
  async save(responseHistoricalModel: ResponseHistoricalModel): Promise<void> {
    await this.dynamoClient.saveItem(
      HISTORICAL_TABLE_NAME,
      responseHistoricalModel
    );
  }
}
