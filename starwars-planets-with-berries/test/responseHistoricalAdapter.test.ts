import { ResponseHistoricalModel } from "../src/domain/models/responseHistorical";
import { IDBClient } from "../src/infrastructure/persistence/IDBClient";
import { GenericPaginatedData } from "../src/infrastructure/persistence/genericPaginatedData";
import { ResponseHistoricalAdapter } from "../src/infrastructure/persistence/adapter/responseHistoricalAdapter";

const mockDynamoClient: jest.Mocked<IDBClient> = {
  getItemByKey: jest.fn(),
  saveItem: jest.fn(),
  queryPaginatedData: jest.fn(),
};

describe("ResponseHistoricalAdapter", () => {
  let adapter: ResponseHistoricalAdapter;

  beforeEach(() => {
    adapter = new ResponseHistoricalAdapter(mockDynamoClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getHistoricalFetchPlanet", () => {
    it("should call dynamoClient.queryPaginatedData and map the result correctly", async () => {
      const mockPaginatedData: GenericPaginatedData<
        ResponseHistoricalModel,
        string,
        string
      > = {
        data: [{ type: "planet", timestamp: "2024-01-01", response: "{}" }],
        lastKey: {
          type: "planet",
          timestamp: "2024-01-01T00:00:00.000Z",
        },
      };

      mockDynamoClient.queryPaginatedData.mockResolvedValue(mockPaginatedData);

      const result = await adapter.getHistoricalFetchPlanet();

      expect(mockDynamoClient.queryPaginatedData).toHaveBeenCalled();

      expect(result.data).toEqual(mockPaginatedData.data);
      expect(result.lastKey).toEqual({
        type: "planet",
        timestamp: "2024-01-01T00:00:00.000Z",
      });
    });
  });

  describe("save", () => {
    it("should call dynamoClient.saveItem with the correct parameters", async () => {
      const historicalModel: ResponseHistoricalModel = {
        type: "planet",
        timestamp: "2024-01-02",
        response: '{"name":"Tatooine"}',
      };
      await adapter.save(historicalModel);
      expect(mockDynamoClient.saveItem).toHaveBeenCalled();
    });
  });
});
