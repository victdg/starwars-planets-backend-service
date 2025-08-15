import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { DynamoClient } from "../src/infrastructure/persistence/dynamoClient";

const ddbMock = mockClient(DynamoDBDocumentClient);

describe("DynamoClient", () => {
  let client: DynamoClient;

  beforeEach(() => {
    ddbMock.reset();
    client = new DynamoClient();
  });

  describe("queryPaginatedData", () => {
    it("should return paginated data and a correctly structured lastKey", async () => {
      const mockItems = [{ id: 1, name: "Tatooine" }];
      const mockLastEvaluatedKey = {
        pk: "some-partition-key",
        sk: "some-sort-key",
      };

      ddbMock.on(QueryCommand).resolves({
        Items: mockItems,
        LastEvaluatedKey: mockLastEvaluatedKey,
      });

      const result = await client.queryPaginatedData(
        "TestTable",
        "pk", // primaryKeyName
        "some-partition-key", // primaryKeyValue
        "sk" // lastSortKeyName
      );

      expect(result.data).toEqual(mockItems);
      expect(result.lastKey).toEqual({
        pk: "some-partition-key",
        sk: "some-sort-key",
      });
    });

    it("should return undefined for lastKey when DynamoDB does not return LastEvaluatedKey", async () => {
      const mockItems = [{ id: 2, name: "Alderaan" }];
      ddbMock.on(QueryCommand).resolves({
        Items: mockItems,
        LastEvaluatedKey: undefined,
      });

      const result = await client.queryPaginatedData(
        "TestTable",
        "pk",
        "value",
        "sk"
      );

      expect(result.data).toEqual(mockItems);
      expect(result.lastKey).toBeUndefined();
    });
  });

  describe("saveItem", () => {
    it("should call ddbDocClient.send with PutCommand and correct parameters", async () => {
      const tableName = "TestTable";
      const item = { id: "123", data: "some-data" };

      await client.saveItem(tableName, item);

      const putCommandCalls = ddbMock.commandCalls(PutCommand);
      expect(putCommandCalls).toHaveLength(1);
      expect(putCommandCalls[0].args[0].input).toEqual({
        TableName: tableName,
        Item: item,
      });
    });
  });

  describe("getItemByKey", () => {
    it("should return the item when found", async () => {
      const tableName = "TestTable";
      const key = { id: "123" };
      const mockItem = { id: "123", name: "Found Item" };
      ddbMock.on(GetCommand).resolves({ Item: mockItem });

      const result = await client.getItemByKey(tableName, key);

      expect(result).toEqual(mockItem);
      const getCommandCalls = ddbMock.commandCalls(GetCommand);
      expect(getCommandCalls).toHaveLength(1);
      expect(getCommandCalls[0].args[0].input).toEqual({
        TableName: tableName,
        Key: key,
      });
    });

    it("should return undefined when item is not found", async () => {
      const tableName = "TestTable";
      const key = { id: "456" };
      ddbMock.on(GetCommand).resolves({ Item: undefined });
      const result = await client.getItemByKey(tableName, key);
      expect(result).toBeUndefined();
    });
  });
});
