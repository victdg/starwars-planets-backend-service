import { GenericKey } from "./genericKey";

export class GenericPaginatedData<T, P, S> {
  data: Array<T>;
  lastKey?: Record<string, any>;
}
