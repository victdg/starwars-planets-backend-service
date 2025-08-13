import { GenericPaginatedData } from "./genericPaginatedData";

export interface IDBClient {
  getItemByKey<T>(
    tableName: string,
    key: Record<string, any>
  ): Promise<T | undefined>;

  saveItem(tableName: string, item: Record<string, any>): Promise<void>;

  queryPaginatedData<T, P, S>(
    tableName: string,
    primaryKeyName: string,
    primaryKeyValue: P,
    lastSortKeyName?: string,
    lastSortKeyValue?: S
  ): Promise<GenericPaginatedData<T, P, S>>;
}
