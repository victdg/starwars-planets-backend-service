import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { REGION } from "../../utils/constants";
import { InternalErrorException } from "../../application/exceptions/internalErrorException";
import { IDBClient } from "./IDBClient";

export class DynamoClient implements IDBClient {
  private readonly ddbClient: DynamoDBClient;
  private readonly ddbDocClient: DynamoDBDocumentClient;

  constructor() {
    this.ddbClient = new DynamoDBClient({ region: REGION });
    this.ddbDocClient = DynamoDBDocumentClient.from(this.ddbClient);
  }

  async getItemByKey<T>(
    tableName: string,
    key: Record<string, any>
  ): Promise<T | undefined> {
    try {
      const command = new GetCommand({
        TableName: tableName,
        Key: key,
      });
      return (await this.ddbDocClient.send(command)).Item as T;
    } catch (error) {
      throw new InternalErrorException(error.message);
    }
  }

  async saveItem(tableName: string, item: Record<string, any>) {
    try {
      const command = new PutCommand({
        TableName: tableName,
        Item: item,
      });
      await this.ddbDocClient.send(command);
    } catch (error) {
      throw new InternalErrorException(error.message);
    }
  }
}
