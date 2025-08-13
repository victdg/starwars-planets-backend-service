import { GenericKey } from "./genericKey";

export class GenericPaginatedData<T, P, S> {
  data: Array<T>;
  lastKey: GenericKey<P, S>;
}
