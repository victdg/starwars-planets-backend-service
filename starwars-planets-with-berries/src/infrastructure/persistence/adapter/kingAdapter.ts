// Import or define KingPort interface/type
import { KingModel } from "../../../application/models/king";
import { KingPort } from "../../../application/ports/kingPort";
import { KING_TABLE_NAME } from "../../../utils/constants";
import { IDBClient } from "../IDBClient";

export class KingAdapter implements KingPort {
  constructor(private readonly dynamoClient: IDBClient) {}

  async saveKing(king: KingModel): Promise<void> {
    await this.dynamoClient.saveItem(KING_TABLE_NAME, king);
  }
}
