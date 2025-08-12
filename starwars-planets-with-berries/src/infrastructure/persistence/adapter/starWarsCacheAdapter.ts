import { StarWarsPlanetModel } from "../../../application/models/starWarsPlanetModel";
import { StarWarsCachePort } from "../../../application/ports/starWarsCachePort";
import { CACHE_TABLE_NAME, TTL_IN_SECONDS } from "../../../utils/constants";
import { IDBClient } from "../IDBClient";
import { StarWarsPlanetDBModel } from "../model/starWarsPlanetDBModel";

export class StarWarsCacheAdapter implements StarWarsCachePort {
  private readonly dynamoClient: IDBClient;

  constructor(dynamoClient) {
    this.dynamoClient = dynamoClient;
  }

  async fetch(id: number): Promise<StarWarsPlanetModel | null> {
    const starWarsPlanetInCache =
      await this.dynamoClient.getItemByKey<StarWarsPlanetDBModel>(
        CACHE_TABLE_NAME!,
        { id }
      );
    if (!starWarsPlanetInCache) {
      return null;
    }
    return starWarsPlanetInCache;
  }

  async save(starWarsPlanet: StarWarsPlanetModel): Promise<void> {
    const ttl = Math.floor(Date.now() / 1000) + TTL_IN_SECONDS;
    this.dynamoClient.saveItem(CACHE_TABLE_NAME!, { ttl, ...starWarsPlanet });
  }
}
