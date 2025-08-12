import { AxiosClient } from "./src/infrastructure/gateway/axiosClient";
import { BerryApiAdapter } from "./src/infrastructure/gateway/adapter/berryApiAdapter";
import { PlanetApiAdapter } from "./src/infrastructure/gateway/adapter/planetApiAdapter";
import { DynamoClient } from "./src/infrastructure/persistence/dynamoClient";
import { StarWarsCacheAdapter } from "./src/infrastructure/persistence/adapter/starWarsCacheAdapter";
import { StarWarsPlanetService } from "./src/application/StarWarsPlanetService";
import { StarWarsController } from "./src/controller/starWarsController";

const axiosClient = new AxiosClient();
const dynamoClient = new DynamoClient();
const planetApiAdapter = new PlanetApiAdapter(axiosClient);
const berryApiAdapter = new BerryApiAdapter(axiosClient);
const starWarsCacheAdapter = new StarWarsCacheAdapter(dynamoClient);
const starWarsPlanetService = new StarWarsPlanetService(
  berryApiAdapter,
  planetApiAdapter,
  starWarsCacheAdapter
);
export const { getPlanets } = new StarWarsController(starWarsPlanetService);
