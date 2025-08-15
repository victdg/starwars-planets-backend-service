import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { IStarWarsPlanet } from "../domain/IStarWarsPlanet";
import {
  errorResponseManager,
  logger,
  requestGenerator,
  responseOkGenerator,
} from "../utils/helpers";
import { REQUEST_INFO } from "../utils/constants";

export class StarWarsController {
  constructor(private readonly starWarsService: IStarWarsPlanet) {}

  async getPlanets(
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> {
    try {
      logger.info(REQUEST_INFO, requestGenerator(event));
      logger.debug("Controller started");
      const id: number = Number(event.pathParameters!.id!);
      const resultFromService = await this.starWarsService.fetchPlanet(id);
      return responseOkGenerator(resultFromService);
    } catch (error) {
      logger.error(error.message, error);
      return errorResponseManager(error);
    }
  }

  async saveKing(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      logger.info(REQUEST_INFO, requestGenerator(event));
      logger.debug("Controller started");
      const planetId: number = Number(event.pathParameters!.planetId!);
      const { kingName } = JSON.parse(event.body!);
      await this.starWarsService.saveKing({
        planetId,
        kingName,
      });
      return responseOkGenerator();
    } catch (error) {
      logger.error(error.message, error);
      return errorResponseManager(error);
    }
  }

  async getHistoricalFetchPlanet(
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> {
    try {
      logger.info(REQUEST_INFO, requestGenerator(event));
      logger.debug("Controller started");
      const lastKey: string = event.queryStringParameters?.lastKey!;

      const resultFromService =
        await this.starWarsService.getHistoricalFetchPlanet(lastKey);
      return responseOkGenerator(resultFromService);
    } catch (error) {
      logger.error(error.message, error);
      return errorResponseManager(error);
    }
  }
}
