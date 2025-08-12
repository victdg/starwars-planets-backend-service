export interface IDBClient {
  getItemByKey<T>(
    tableName: string,
    key: Record<string, any>
  ): Promise<T | undefined>;

  saveItem(tableName: string, item: Record<string, any>): Promise<void>;
}
