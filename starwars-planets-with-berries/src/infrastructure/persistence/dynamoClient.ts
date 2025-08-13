import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { PAGINATED_LIMIT, REGION } from "../../utils/constants";
import { InternalErrorException } from "../../application/exceptions/internalErrorException";
import { IDBClient } from "./IDBClient";
import { GenericPaginatedData } from "./genericPaginatedData";

export class DynamoClient implements IDBClient {
  private readonly ddbClient: DynamoDBClient;
  private readonly ddbDocClient: DynamoDBDocumentClient;

  constructor() {
    this.ddbClient = new DynamoDBClient({ region: REGION });
    this.ddbDocClient = DynamoDBDocumentClient.from(this.ddbClient);
  }
  async queryPaginatedData<T, P, S>(
    tableName: string,
    primaryKeyName: string,
    primaryKeyValue: P,
    lastSortKeyName: string,
    lastSortKeyValue?: S
  ): Promise<GenericPaginatedData<T, P, S>> {
    try {
      const params: QueryCommandInput = {
        TableName: tableName,
        KeyConditionExpression: `#pk = :pk`,
        ExpressionAttributeValues: {
          ":pk": primaryKeyValue,
        },
        ExpressionAttributeNames: {
          "#pk": primaryKeyName,
        },

        ExclusiveStartKey:
          lastSortKeyValue !== undefined
            ? {
                [primaryKeyName]: primaryKeyValue,
                [lastSortKeyName]: lastSortKeyValue,
              }
            : undefined,
        Limit: PAGINATED_LIMIT,
      };
      console.log("params::>>", params);
      const foundedData = await this.ddbDocClient.send(
        new QueryCommand(params)
      );
      console.log("params");
      console.log(params);

      let lastKey: Record<string, any> | undefined = undefined;
      if (foundedData.LastEvaluatedKey) {
        lastKey = {
          [primaryKeyName]: foundedData.LastEvaluatedKey[primaryKeyName] as P,
          [lastSortKeyName]: foundedData.LastEvaluatedKey[lastSortKeyName] as S,
        };
      }

      const data = foundedData.Items as T[];
      return { data, lastKey };
    } catch (error) {
      console.log(error);
      throw new InternalErrorException(error.message);
    }
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
      console.log(error);
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
      console.log(error);
      throw new InternalErrorException(error.message);
    }
  }
}
